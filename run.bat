@echo off
setlocal

echo ==============================
echo Checking for Java 21...
echo ==============================

:: Check for Java 21
java -version 2>&1 | find "21." >nul
if %errorlevel% neq 0 (
    echo ERROR: Java 21 is not installed.
    echo Please install it from: https://www.oracle.com/java/technologies/downloads/#jdk21-windows
    pause
    exit /b
)
echo Java 21 is installed.
echo.

echo ==============================
echo Checking for Node.js...
echo ==============================

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed.
    echo Please install it from: https://nodejs.org/en/download
    pause
    exit /b
)
echo Node.js is installed.
echo.

echo ==============================
echo Starting Backend...
echo ==============================

:: Start backend in a new CMD window
cd backend
start cmd /k "echo Running backend... && mvnw spring-boot:run"
cd ..
echo Backend is starting in a separate window.
echo.

echo ==============================
echo Checking Frontend Dependencies...
echo ==============================

:: Go to frontend directory
cd frontend

:: Check if React is installed
if not exist "node_modules/react" (
    echo React is not installed. Installing now...
    call npm install react --loglevel=error
    if not exist "node_modules/react" (
        echo ERROR: React installation failed. Please check your npm setup.
        pause
        exit /b
    )
    echo React installation finished.
) else (
    echo React is already installed.
)

:: Check if any MUI libraries are missing
set "MISSING_LIBS="
if not exist "node_modules/@mui/material" set MISSING_LIBS=1
if not exist "node_modules/@mui/icons-material" set MISSING_LIBS=1
if not exist "node_modules/@mui/x-date-pickers" set MISSING_LIBS=1
if not exist "node_modules/date-fns" set MISSING_LIBS=1

:: Install MUI libraries if any are missing
if defined MISSING_LIBS (
    echo Some MUI libraries are missing. Installing now...
    call npm install @mui/material @mui/icons-material @mui/x-date-pickers date-fns --loglevel=error
) else (
    echo All required MUI libraries are installed.
)

:: Verify that MUI libraries are installed correctly
if not exist "node_modules/@mui/material" (
    echo ERROR: @mui/material installation failed.
    pause
    exit /b
)
if not exist "node_modules/@mui/icons-material" (
    echo ERROR: @mui/icons-material installation failed.
    pause
    exit /b
)
if not exist "node_modules/@mui/x-date-pickers" (
    echo ERROR: @mui/x-date-pickers installation failed.
    pause
    exit /b
)
if not exist "node_modules/date-fns" (
    echo ERROR: date-fns installation failed.
    pause
    exit /b
)

echo MUI dependencies checked.
echo.

echo ==============================
echo Starting Frontend...
echo ==============================

:: Start frontend (keeping the window open)
echo Launching frontend...
start cmd /k "cd /d %CD% && npm start"

:: Return to root directory
cd ..

echo.
echo ==============================
echo Script execution finished. Press any key to exit.
echo ==============================
pause
endlocal
