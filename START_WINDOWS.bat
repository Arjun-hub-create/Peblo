@echo off
echo ========================================
echo   Peblo Neural Workspace - Starting...
echo ========================================

echo.
echo [1/2] Starting Backend Server...
start "Peblo Backend" cmd /k "cd /d %~dp0server && npm install && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend...
start "Peblo Frontend" cmd /k "cd /d %~dp0client && npm install && npm run dev"

echo.
echo ========================================
echo   Both servers starting in new windows!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo   Health:   http://localhost:5000/api/health
echo ========================================
echo.
pause
