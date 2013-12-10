BUILD := build
BIN := node_modules/.bin

all: lint test

test:
	@./test/run-test.sh

lint:
	@$(BIN)/jshint test/*.js *.js *.json

clean:
	@rm -f $(BUILD)/*

.PHONY: all test lint clean
