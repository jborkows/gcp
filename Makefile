SHELL := /bin/bash
all: commitP startDev listBuckets

.PHONY: all
commitP:
# use make commit message="ssss"
ifdef message
	@git fetch && git add --all . && git commit -m "$(message)" && git rebase --onto origin/`git branch --show-current` && git push
else
	@echo 'message must be given'
endif
listBuckets:
	@${SHELL} listBuckets.sh
startDev:
	@${SHELL} start_dev.sh
stopDev:
	@${SHELL} stop_dev.sh
