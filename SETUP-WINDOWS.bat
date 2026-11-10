@echo off
cd /d "%~dp0"
if not exist .env.local (
  copy .env.example .env.local >nul
  echo File .env.local dibuat. Isi URL dan Publishable Key Supabase terlebih dahulu.
  notepad .env.local
  pause
  exit /b
)
if not exist node_modules (
  echo Menginstall dependency...
  npm install
)
echo Menjalankan DiinLy Finance...
npm run dev
pause
