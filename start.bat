@echo off
TITLE Wedding Invitation Project (Windows)
setlocal
cd /d %~dp0

echo ==========================================================
echo    🎉 WEDDING INVITATION PROJECT TRIGGER (Windows) 🎉     
echo ==========================================================
echo.

:: 1. Check if Node.js is installed
echo 🔍 Checking System Requirements...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ ERROR: Node.js is not installed!
    echo Please download and install it from: https://nodejs.org/
    echo.
    pause
    exit /b
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo ✅ Node.js %NODE_VER% is installed.

:: 2. Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ ERROR: npm is not available!
    echo.
    pause
    exit /b
)
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo ✅ npm %NPM_VER% is installed.

:: 3. Setup Environment Variables (.env)
if not exist .env.local (
    if exist .env.local.example (
        echo 📝 Creating .env.local from .env.local.example...
        copy .env.local.example .env.local
        echo ✅ .env.local created.
    ) else (
        echo ℹ️  No .env.local.example found, skipping environment setup.
    )
)

:: 4. Check for node_modules (Installation)
if not exist node_modules (
    echo 📦 node_modules not found. Installing dependencies (this may take a while)...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ ERROR: Dependency installation failed.
        pause
        exit /b
    )
    echo ✅ Dependencies installed successfully!
) else (
    echo ✅ node_modules found. Skipping installation.
)

:: 5. Final Step: Run the project
echo.
echo 🚀 Everything is ready! Starting the development server...
echo ==========================================================
echo The app should be available at http://localhost:3000
echo.

call npm run dev

:: If npm fails or terminates, keep window open
if %ERRORLEVEL% neq 0 (
    echo.
    echo ⚠️  Project stopped with an error.
    pause
)
