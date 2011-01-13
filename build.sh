#!/bin/sh
# 
#  build.sh
#  borrowed from bitly/bitly_chrome_extension
#  


HOST_FILES="manifest.json"
CWD=`pwd`
#KEY="/PATH/to/chrome_extension.pem"
KEY=$1

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -f "$CHROME" ]; then
    echo error: ${CHROME} is not accessible
    echo "hint: run this from your mac"
    exit 1;
fi

if [ ! -f "$CWD/src/manifest.json" ]; then
    echo "must be run from the chrome_extension directory"
    exit 1;
fi

## now increment the trailing version number
perl -pe 's/(\s+.version.: .\d+\.\d+\.\d+\.)(\d+)/$1.($2+1)/eg' -i "src/manifest.json"

VERSION=`cat src/manifest.json | grep '"version"' | awk -F '"' '{print $4}'`
echo "new extension version is $VERSION"

# build the crx file
mkdir -p "$CWD/build"
echo "compiling fluidinfo_iownit.crx";
"$CHROME" --pack-extension=$CWD/src --pack-extension-key=$KEY --no-message-box
mv "$CWD/src.crx" "$CWD/build/fluidinfo_iownit-$VERSION.crx"
echo "finished build/fluidinfo_iownit-$VERSION.crx";

