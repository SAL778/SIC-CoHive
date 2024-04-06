# UBUNTU/LINUX MAKEFILE
default: setup_backend run_backend setup_frontend run_frontend

setup_backend:
    python -m pip install -r requirements.txt
    cd backend && python manage.py makemigrations && python manage.py migrate

run_backend:
    cd backend && python manage.py runserver &

setup_frontend:
    cd frontend && npm install

run_frontend:
    cd frontend && npm run dev &

.PHONY: default setup_backend run_backend setup_frontend run_frontend
