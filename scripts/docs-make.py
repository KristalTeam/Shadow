#!/usr/bin/python3

from pathlib import Path
import subprocess
from contextlib import chdir
import requests
import platform
import zipfile
import shutil
import os
import stat

current_os = platform.system()

with open("scripts/lls-vm-inject.lua", "r", encoding="utf-8") as f:
    injected_code = f.read()

Path("tmp").mkdir(parents=True, exist_ok=True)
Path("app/data").mkdir(parents=True, exist_ok=True)

with chdir("tmp"):
    print("Cloning Kristal...")

    # check if we have git
    try:
        subprocess.run(["git", "--version"], check=True, stdout=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        print("Git is not installed or not found in PATH. Please install Git to proceed.")
        exit(1)

    # its fine if this fails
    subprocess.run(["git", "clone", "--depth=1", "-b", "main", "https://github.com/KristalTeam/Kristal", "kristal"])

    print("Downloading lua-language-server...")

    # we need to grab the latest release of luals
    req = requests.get("https://api.github.com/repos/LuaLS/lua-language-server/releases/latest")
    json = req.json()["assets"]
    url = None

    for asset in json:
        if (current_os == "Linux") and ("linux" in asset["name"]) and ("x64" in asset["name"]):
            url = asset["browser_download_url"]
            break
        if (current_os == "Windows") and ("win32" in asset["name"]) and ("x64" in asset["name"]):
            url = asset["browser_download_url"]
            break

    if url is None:
        print("Could not find a compatible release of lua-language-server for your OS; got " + current_os)
        exit(1)

    print("Downloading from " + url)
    r = requests.get(url)

    with open("lua-language-server.zip", "wb") as f:
        f.write(r.content)

    # delete lua-language-server folder if it exists
    if Path("lua-language-server").exists():
        shutil.rmtree('lua-language-server')

    # unzip the file
    with zipfile.ZipFile("lua-language-server.zip", "r") as zip_ref:
        zip_ref.extractall("lua-language-server")

    # delete the zip file
    Path("lua-language-server.zip").unlink()

    # if we're on linux, we need to make the binary executable
    if current_os == "Linux":
        Path("lua-language-server/bin/lua-language-server").chmod(0o755)

    # okay so we need to inject a function into the lang server
    with open("lua-language-server/script/vm/compiler.lua", "a", encoding="utf-8") as f:
        f.write(injected_code)

    # looking good, gen the docs
    subprocess.run(["lua-language-server/bin/lua-language-server", "--doc=kristal", "--doc_out_path=../app/data"], check=True)

# done, remove tmp

def remove_readonly(func, path, _):
   os.chmod(path, stat.S_IWRITE)
   func(path)

shutil.rmtree('tmp', onexc=remove_readonly)