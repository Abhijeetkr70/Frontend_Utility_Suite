@echo off
echo Starting Frontend Utility Suite...
echo.
echo Option 1: Using Node.js (recommended)
where npx >nul 2>nul && (
  npx serve . -l 3000
  goto :end
)
echo Node.js not found.
echo.
echo Option 2: Using Python
where python >nul 2>nul && (
  echo Starting Python HTTP server on port 3000...
  python -m http.server 3000
  goto :end
)
echo Python not found.
echo.
echo Please install Node.js or Python, or use VS Code Live Server.
echo.
:end
pause
