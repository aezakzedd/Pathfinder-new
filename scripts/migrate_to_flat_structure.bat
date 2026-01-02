@echo off
REM Windows Batch Script for Image Migration
REM Run this in the repository root directory

echo ============================================================
echo Image Structure Migration Tool (Windows)
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3 from https://www.python.org/
    pause
    exit /b 1
)

echo Running Python migration script...
echo.

python scripts\migrate_to_flat_structure.py

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo Migration completed successfully!
    echo ============================================================
    echo.
    echo Next steps:
    echo 1. Review images: dir public\assets\images\
    echo 2. Delete old folders: rmdir /s /q src\assets\Baras src\assets\Virac ...
    echo 3. Commit: git add . ^&^& git commit -m "Migrated to flat structure"
    echo.
) else (
    echo.
    echo ============================================================
    echo Migration failed! Check the error messages above.
    echo ============================================================
    echo.
)

pause
