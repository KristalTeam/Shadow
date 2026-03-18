#!/usr/bin/env bash
set -eufo pipefail

# make sure we're in <sourcedir>/..
cd "$(dirname "$0")/.."

# check for python3
if ! command -v python3 >/dev/null 2>&1; then
    echo "python3 could not be found, please install it to run this script"
    exit 1
fi

# check for pip
if ! python3 -m pip --version >/dev/null 2>&1; then
    echo "pip could not be found, please install it to run this script"
    exit 1
fi

python3 -m pip install requests
python3 scripts/docs-make.py
