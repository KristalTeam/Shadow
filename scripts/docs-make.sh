#!/usr/bin/env bash
set -eufo pipefail

pushd .

mkdir tmp
mkdir app/data
cd tmp
export PATH=$PWD:$PATH

git clone --depth=1 -b main https://github.com/KristalTeam/Kristal.git kristal
#git clone --depth=1 -b ldoc-test https://github.com/skarph/Kristal.git kristal

git clone --depth=1 -b doc-builder https://github.com/skarph/luacats-docgen lua-language-server

popd
chmod +x tmp/lua-language-server/21-07-24-ubuntu-binary/lua-language-server
tmp/lua-language-server/21-07-24-ubuntu-binary/lua-language-server --doc=tmp/kristal --doc_out_path=app/data

rm -rf tmp
