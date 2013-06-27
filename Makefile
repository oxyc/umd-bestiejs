BUILD := build
BIN := node_modules/.bin

all: build test

build: clean browserify component rjs

test:
	@./test/run-test.sh

lint:
	@$(BIN)/jshint test/*.js *.js *.json

browserify: umd-bestiejs.js
	$(BIN)/browserify -r ./$(subst .js,,$^) > $(BUILD)/browserify.js

component:
	$(BIN)/component build -o $(BUILD) -n component

rjs: umd-bestiejs.js
	$(BIN)/r.js -o baseUrl=. name=$(subst .js,,$^) out=$(BUILD)/rjs.js > /dev/null

clean:
	@rm -f $(BUILD)/*

.PHONY: build test lint browserify component rjs clean
