#!/bin/bash
pushd "$(dirname "$0")" >/dev/null

root=..
bin=node_modules/.bin
require_path=node_modules/requirejs/require
build_dir=build
pass=0
fail=0

files=(
  "umd-dependencies,umd-standalone"
  "umd-standalone"
)

scaffoldComponentJson() {
  local name=$1
  local scripts=$2
  node <<<"
  console.log(JSON.stringify({
    name: \"${name}\",
    main: \"${name}.js\",
    scripts: [\"${scripts/,/.js\",\"}.js\"],
    dependencies: {}
  }, null, '  '));
" > component.json
}

build() {
  local files="$1"
  local name=${files/,*/}

  echo "# Building $name"
  pushd $root > /dev/null
  {
    $bin/browserify -r ./$name >| $build_dir/$name-browserify.js
    scaffoldComponentJson "$name" "$files"
    $bin/component build -o $build_dir -n $name-component
    $bin/r.js -o baseUrl=. paths.requireLib=$require_path \
      name=$name include=requireLib out=$build_dir/$name-rjs.js
  } > /dev/null
  popd > /dev/null
}

assert() {
  local cmd=$1
  local message=$2
  eval $cmd &> /dev/null
  if [ $? -eq 0 ]; then
    pass=$((pass + 1))
    success="ok"
  else
    fail=$((fail + 1))
    success="not ok"
    # Remove newlines to provide valid TAP output. All extra liens should be
    # indented.
    local output="$($cmd 2>&1 | tr '\n' ' ')"
    message="$message\n\t$output"
  fi
  echo -e "$success $((pass + fail)) $message"
}

# Run all tests on specified file-sets. The first file in the comma separated
# list should be the main entry point.
runTest() {
  local files=$1
  local mainFile=${files/,*/}
  local engine=
  local loader=

  echo "# Testing $files"
  for engine in rhino "rhino -require" narwhal ringo d8; do
    if which ${engine% *} &>/dev/null; then
      [[ $engine == "d8" ]] && local argDelimiter="--" || local argDelimiter=""
      assert "$engine test.js $argDelimiter ../${mainFile}.js" "$files - $engine"
    fi
  done
  for loader in amd browserify component rjs browser leaked-exports; do
    assert "phantomjs phantomjs-runner.js 'test.html?files=$files&loader=$loader'" "$files - $loader"
  done

}

# Clean old build files
rm -f $root/$build_dir/*
# Initialize
for file in "${files[@]}"; do
  build "$file"
  runTest "$file"
done

echo
echo "1..$((pass + fail))"
echo "# tests $((pass + fail))"
echo "# pass $pass"
echo "# fail $fail"

popd > /dev/null

exit $fail
