#!/bin/bash
pushd "$(dirname "$0")" >/dev/null
pass=0
fail=0

assert() {
  local cmd=$1
  local message=$2
  $cmd &> /dev/null
  if [ $? -eq 0 ]; then
    pass=$((pass + 1))
    success="ok"
  else
    fail=$((fail + 1))
    success="not ok"
    local output="$($cmd 2>&1 | tr '\n' ' ')"
    message="$message\n\t$output"
  fi
  echo -e "$success $((pass + fail)) $message"
}

for cmd in rhino "rhino -require" narwhal ringo d8; do
  if which ${cmd% *} &>/dev/null; then
    assert "$cmd test.js ../umd-bestiejs.js" "$cmd"
  fi
done

for flag in amd browserify component rjs browser; do
  assert "phantomjs phantomjs-runner.js test.html?$flag" "$flag"
done

echo
echo "1..$((pass + fail))"
echo "# tests $((pass + fail))"
echo "# pass $pass"
echo "# fail $fail"

exit $fail

popd > /dev/null
