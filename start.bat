@echo off
echo ========================================================
echo         EduLens: Student Cohort Discovery
echo          Unit III Machine Learning Project
echo ========================================================
echo.

echo Starting Flask Backend on http://localhost:5000 ...
start "EduLens Backend (Flask)" cmd /k "cd backend && python app.py"

timeout /t 2 /nobreak >nul

echo Starting React Frontend on http://localhost:5173 ...
start "EduLens Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo EduLens is booting up!
echo Open your browser at: http://localhost:5173
echo.
pause

