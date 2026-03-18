@echo off

REM make sure we're in <sourcedir>/..

cd %~dp0\..

REM we need to find python3, but it might be called python on some systems

python3 --version >nul 2>&1

if %errorlevel% == 0 (
    set PYTHON=python3
    GOTO found
)

python --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON=python
    GOTO found
)

py --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON=py
    GOTO found
)

:notfound
echo Python 3 is required to run this script. Please install Python 3 and make sure it is added to your PATH.
exit /b 1

:found

echo Python executable found -- %PYTHON%

%PYTHON% scripts/docs-make.py
