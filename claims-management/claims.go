package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"reflect"
	"strings"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/pkg/errors"
	"google.golang.org/api/option"
)

func AvailableClaims() Claims {
	return Claims{Claim("admin"), Claim("reader"), Claim("writer"), Claim("")}
}

var firebaseConfig string
var projectId string

func fetchEnv(environmentVariableName string) string {
	env := os.Getenv(environmentVariableName)
	if env == "" {
		err := errors.New(fmt.Sprintf("Cannot find %s", environmentVariableName))
		log.Fatalf("%+v \n", err)
		os.Exit(1)
	}
	return env
}

func getUser(ctx context.Context, app *firebase.App, userEmail string) *auth.UserRecord {

	// [START get_user_golang]
	// Get an auth client from the firebase.App
	client, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	u, err := client.GetUserByEmail(ctx, userEmail)
	if err != nil {
		log.Fatalf("error getting user %s: %v\n", userEmail, err)
	}
	// log.Printf("Successfully fetched user data: %v\n", u)
	// [END get_user_golang]
	return u
}

var firebaseApp *firebase.App

func init() {
	firebaseConfig = fetchEnv("FIREBASE_CONFIG")
	projectId = fetchEnv("PROJECT_ID")
	projectId = strings.ReplaceAll(projectId, "\"", "")
	ctx := context.Background()

	config := &firebase.Config{ProjectID: projectId}

	opt := option.WithCredentialsJSON([]byte(firebaseConfig))
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	firebaseApp = app
}

func ListUsersClaims(userName string) []string {
	user := getUser(context.Background(), firebaseApp, userName)
	keys := make([]string, 0, len(user.CustomClaims))
	for k := range user.CustomClaims {
		keys = append(keys, fmt.Sprintf("%v -> %v", k, user.CustomClaims[k]))
	}
	return keys
}

type Claim string
type Claims []Claim

func (i *Claims) String() string {
	return "my string representation"
}

func (i *Claims) Set(value string) error {
	*i = append(*i, Claim(value))
	return nil
}

type OperationDto struct {
	UserEmail string
	ClaimName Claims
}

func (claims Claims) contains(claim Claim) bool {
	for _, a := range claims {
		if  strings.Contains(string(a),string(claim)) {
			return true
		}
	}
	return false
}

func contains(value string, values []string) bool {
	log.Println(value)
	for _, a := range values {
		if a == value {
			return true
		}
	}
	return false
}

func (dto OperationDto) validateClaims() (bool, error) {
	for _, claim := range dto.ClaimName {
		if !AvailableClaims().contains(claim) {
			return false, errors.New(fmt.Sprintf("Unrecognized claim %v\n", claim))
		}
	}
	return true, nil
}

func privsName() string { return fetchEnv("USER_PRIVS_CLAIM") }

func foundPrivs(user *auth.UserRecord) bool {
	for k, _ := range user.CustomClaims {
		if k == privsName() {
			return true
		}
	}
	return false
}

func putNewClaim(claims []string, userUID string) (bool, error) {
	asMap := make(map[string]interface{})
	client, err := firebaseApp.Auth(context.Background())
	if err != nil {
		return false, errors.New("Cannot get user.")
	}
	asMap[privsName()] = claims
	log.Printf("Setting %v on %v", asMap, userUID)
	err = client.SetCustomUserClaims(context.Background(), userUID, asMap)
	if err != nil {
		return false, errors.New(fmt.Sprintf("Cannot cast %v %v", asMap, err))
	}
	err = client.RevokeRefreshTokens(context.Background(), userUID)
	if err != nil {
		return false, errors.New(fmt.Sprintf("Revoking failed  %v", err))
	}
	return true, nil
}

func (dto OperationDto) Delete() (bool, error) {
	ok, error := dto.validateClaims()
	if !ok {
		return false, error
	}
	user := getUser(context.Background(), firebaseApp, dto.UserEmail)

	if !foundPrivs(user) {
		return false, errors.New("Cannot find privs for user")
	}

	
	temp, ok := user.CustomClaims[privsName()].([]interface{})
	if !ok {
		return false, errors.New(fmt.Sprintf("Cannot cast %v type is %v", user.CustomClaims[privsName()], reflect.TypeOf(user.CustomClaims[privsName()])))
	}
	array := make([]string, 0, 10)
	for _, v := range temp {
		claim, _ := v.(string)
		array = append(array, claim)
	}
	newprivs:=make([]string, 10)
	for _, value := range array{
		if !dto.ClaimName.contains(Claim(value)) {
			newprivs = append(newprivs, string(value))
		}
	}
	return putNewClaim(newprivs, user.UID)

}

func (dto OperationDto) Add() (bool, error) {
	ok, error := dto.validateClaims()
	if !ok {
		return false, error
	}
	user := getUser(context.Background(), firebaseApp, dto.UserEmail)
	var array []string
	if foundPrivs(user) {
		temp, ok := user.CustomClaims[privsName()].([]interface{})
		if !ok {
			return false, errors.New(fmt.Sprintf("Cannot cast %v type is %v", user.CustomClaims[privsName()], reflect.TypeOf(user.CustomClaims[privsName()])))
		}
		array = make([]string, 0, 10)
		for _, v := range temp {
			claim, _ := v.(string)
			array = append(array, claim)
		}
	} else {
		array = make([]string, 0, len(dto.ClaimName))
	}
	newprivs := make([]string, len(array))
	copy(newprivs, array)
	for _, value := range dto.ClaimName {
		if !contains(string(value), array) {
			newprivs = append(newprivs, string(value))
		}
	}
	return putNewClaim(newprivs, user.UID)
}
