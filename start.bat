@REM WINDOWS BATCH FILE

@echo off
REM Setup Backend
python -m pip install -r requirements.txt
cd backend
python manage.py makemigrations
python manage.py migrate
start /b python manage.py runserver

REM Give the server some time to start. Adjust the timeout as necessary.
timeout /t 5

cd ..

REM Setup Frontend
cd frontend
npm install
start /b npm run dev

echo Servers are running...
pause
