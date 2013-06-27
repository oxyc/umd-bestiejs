BUILD := build

all: build test

build: clean browserify component rjs

test:
	@./test/run-test.sh

lint:
	@jshint test/*.js *.js *.json

browserify: umd-bestiejs.js
	browserify -r ./$(subst .js,,$^) > $(BUILD)/browserify.js

component:
	component build -o $(BUILD) -n component

rjs: umd-bestiejs.js
	r.js -o baseUrl=. name=$(subst .js,,$^) out=$(BUILD)/rjs.js > /dev/null

install:
	@npm install -g requirejs
	@npm install -g component
	@npm install -g browserify
	@npm install -g bower
	@npm install -g jshint
	@bower install requirejs

clean:
	@rm -f $(BUILD)/*

.PHONY: build test lint browserify component rjs install clean
