import sys

debug = True

def executeCommand(*commandAsArray):
    import subprocess
    lists = [item for item in commandAsArray]
    if debug:
        print("Executing command {}".format(lists))
    process = subprocess.Popen(" ".join(lists),
                               shell=True,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    return stdout, stderr

def runCommand(*commandAsArray):
    stdout,stderr = executeCommand(*commandAsArray)
    errors = stderr.decode("utf-8")
    if errors:
        print("Error calling {}".format(commandAsArray))
        print(st)
        sys.exit(-1)
    print(stdout.decode("utf-8"))    

def main():
    args = sys.argv[1:]
    if len(args) == 0:
        stdout,stderr = executeCommand("git", "status")
        print(stderr.decode("utf-8"))
        print(stdout.decode("utf-8"))
        return
    elif len(args) == 1:
        print("Commiting using commit message '{}'".format(args[0]))
        runCommand("git", "add", ".")
        runCommand("git", "commit", "-m", "'{}'".format(args[0]))
        runCommand("git", "push")
    print(args)

if __name__ == "__main__":
    main()
