var system = require('system');

function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001
    , start = new Date().getTime()
    , condition = false
    , interval = setInterval(function() {
      if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
        // If not time-out yet and condition not yet fulfilled
        condition = testFx();
      } else {
        // If condition still not fulfilled (timeout but condition is 'false')
        if(!condition) phantom.exit(1);
        else {
          onReady();
          clearInterval(interval);
        }
      }
    }, 100);
}

if (system.args.length !== 2) {
  console.log('Usage: test.js URL');
  phantom.exit(1);
}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.open(system.args[1], function(status){
  if (status !== "success") {
    console.log("Unable to access network");
    phantom.exit(1);
  }

  waitFor(function(){
    return page.evaluate(function(){
      var el = document.getElementById('tests');
      return el && el.innerText.length;
    });
  }, function(){
    var failedNum = page.evaluate(function(){
      var pass = document.getElementById('pass').innerText
        , fail = document.getElementById('fail').innerText
        , tests = document.getElementById('tests').innerText
        , assertions = document.getElementById('assertions').innerText.replace(/<br>/, '\n');

      console.log(assertions.replace(/(ok|not ok) (\d+) (.*)\n?$/gm, '$1 $3'));
      try {
        return fail;
      } catch (e) { }
      return 10000;
    });
    phantom.exit((parseInt(failedNum, 10) > 0) ? 1 : 0);
  });
});
