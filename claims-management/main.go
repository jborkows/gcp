package main

import (
	"flag"
	"fmt"
	"log"
	"os"
)

const usage = `Usage:
  no options list all available claims
  -l, --list list all claims
  -u, --user user email
  -h, --help prints help information 
  -c, --claim claim use with combination of user and -a or -d
  -a, --add add operation
  -d, --delete delete opration 
`

func endWithFail() {
	os.Exit(1)
}

var claimsList Claims

func fail(msg string) {
	log.Fatalln(msg)
}

func success(msg string){
	log.Println(msg)
	os.Exit(0)
}

func main() {
	var listAll bool
	flag.BoolVar(&listAll, "list", false, "list all claims")
	flag.BoolVar(&listAll, "l", false, "list all claims")
	var userEmail string
	flag.StringVar(&userEmail, "user", "", "user email")
	flag.StringVar(&userEmail, "u", "", "user email")

	flag.Var(&claimsList, "claim", "pass claim as argument")
	flag.Var(&claimsList, "c", "pass claim as argument")

	var addFlag bool
	flag.BoolVar(&addFlag, "add", false, "add operation")
	flag.BoolVar(&addFlag, "a", false, "add operation")

	var deleteFlag bool
	flag.BoolVar(&deleteFlag, "delete", false, "delete operation")
	flag.BoolVar(&deleteFlag, "d", false, "delete operation")

	flag.Usage = func() { fmt.Print(usage) }
	flag.Parse()

	if listAll {
		if userEmail == "" {
			fail("when listing for claims you have to pass user email")
		}
		success(fmt.Sprintf("%v have %v \n", userEmail, ListUsersClaims(userEmail)))
	}

	if deleteFlag || addFlag {
		if deleteFlag && addFlag {
			fail("Cannot add and delete at same time")
		}
		if userEmail == "" {
			fail("In case of adding or removing claims you have to pass userEmail")
		}
		if claimsList == nil || len(claimsList) == 0 {
			fail("In case of adding or removing claims you have to pass claims")
		}
		operationDto := OperationDto{
			UserEmail: userEmail,
			ClaimName: claimsList,
		}
		if deleteFlag {
			ok, error := operationDto.Delete()
			if !ok {
				log.Fatal("Cannot delete claim \n", error)
			}
			success("Claims deleted")
		}
		if addFlag {
			ok, error := operationDto.Add()
			if !ok {
				log.Fatal("Cannot add claim \n", error)
			}
			success("Claims added")
		}

	}

	if userEmail == "" {
		fmt.Printf("Available claims: %+q \n", AvailableClaims())
		return
	}

	fail("Unkown combination")
}
