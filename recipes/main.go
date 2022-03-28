package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
	// "google.golang.org/api/option"
)

func main() {
	log.Print("starting server...")
	http.HandleFunc("/", handler)

	// Determine port for HTTP service.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("defaulting to port %s", port)
	}

	// Start HTTP server.
	log.Printf("listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

func getUser(ctx context.Context, app *firebase.App,uid string ) *auth.UserRecord {
	

	// [START get_user_golang]
	// Get an auth client from the firebase.App
	client, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	u, err := client.GetUser(ctx, uid)
	if err != nil {
		log.Fatalf("error getting user %s: %v\n", uid, err)
	}
	log.Printf("Successfully fetched user data: %v\n", u)
	// [END get_user_golang]
	return u
}

func exists(path string) bool {
        _, err := os.Stat(path)
        return !errors.Is(err, os.ErrNotExist)
    }

func writeConfig(path string){
        f,err := os.Create(path)
        if err != nil {
                fmt.Println(err)
        }
        defer f.Close()
        f.Write([]byte( os.Getenv("FIREBASE_CONFIG")))
}

func handler(w http.ResponseWriter, r *http.Request) {
	name := os.Getenv("NAME")
	if name == "" {
		name = "World"
	}

        envPath := "firebase.json"
        fileExists := exists(envPath)
        if(!fileExists){
                log.Printf("Firebase config %v\n", os.Getenv("FIREBASE_CONFIG"))
                writeConfig(envPath)
        }
        

        if reqHeadersBytes, err := json.Marshal(r.Header); err != nil {
                log.Println("Could not Marshal Req Headers")
            } else {
                log.Println(string(reqHeadersBytes))
            }

        ctx := context.Background()
        projectId := os.Getenv("PROJECT_ID")
        config := &firebase.Config{ProjectID: projectId}

        opt := option.WithCredentialsJSON([]byte( os.Getenv("FIREBASE_CONFIG")))
        app, err := firebase.NewApp(ctx, config, opt)
        if err != nil {
                        log.Fatalf("error initializing app: %v\n", err)
                }
        client, err := app.Auth(ctx)
        if err != nil {
                log.Fatalf("error initializing client: %v\n", err)
        }
        reqToken := r.Header.Get("Authorization")
        tokenExtractor := regexp.MustCompile(`[Bb]earer (?P<token>.+)`)
        matches := tokenExtractor.FindStringSubmatch(reqToken)
        if matches == nil {
                log.Fatalf("Cannot extract bearer: %v\n", reqToken)
        }
        idTokenIndex := tokenExtractor.SubexpIndex("token")
        idToken := matches[idTokenIndex]
        log.Printf("Id token: %v\n", idToken)
        token, err := client.VerifyIDToken(ctx, idToken)

        if err != nil {
                log.Fatalf("error verifying ID token: %v\n", err)
        }
        
        log.Printf("Verified ID token: %v\n", token)
       

        //not working auth/insufficient-permission
        user := getUser(context.Background(), app, token.UID)

	log.Printf("User ID: %v\n", user)

	fmt.Fprintf(w, "AAxxxA %s %s!\n", name, "verified")
}
