@echo off
title Census Income Prediction — Full Stack Launcher
color 0B
cls

echo ================================================================================
echo.
echo    [+] CENSUS INCOME PREDICTION SYSTEM
echo    [+] Machine Learning  ^|  FastAPI Backend  ^|  React Dashboard
echo.
echo ================================================================================
echo.

echo  [1/4] Checking system environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Python not found in PATH!
    echo      Please ensure Python is installed.
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js not found in PATH!
    echo      Please ensure Node.js is installed.
    pause
    exit /b 1
)
echo  [*] Python and Node.js are available!
echo.

echo  [2/4] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Census Backend (FastAPI)" cmd /k "cd /d "%~dp0" && color 0A && echo FastAPI Backend Running... && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo  Waiting for Backend to start...
ping 127.0.0.1 -n 4 >nul
echo  [*] Backend service initialized!
echo.

echo  [3/4] Starting React Frontend on http://127.0.0.1:5173 ...
start "Census Frontend (React Vite)" cmd /k "cd /d "%~dp0frontend" && color 0E && echo React Frontend Running... && npm run dev -- --host 127.0.0.1 --port 5173"

echo  Waiting for Frontend to start...
ping 127.0.0.1 -n 4 >nul
echo  [*] Frontend service initialized!
echo.

echo  [4/4] Opening Web Dashboard in default browser...
start http://127.0.0.1:5173/

echo.
echo ================================================================================
echo                    APPLICATION IS RUNNING SUCCESSFULLY!
echo ================================================================================
echo.
echo   * React Dashboard:    http://127.0.0.1:5173/
echo   * FastAPI Backend:    http://127.0.0.1:8000/
echo   * Swagger API Docs:   http://127.0.0.1:8000/docs
echo.
echo   Keep the two opened service windows running in the background.
echo   To stop the application, simply close the service windows.
echo ================================================================================
echo.
pause
