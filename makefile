# UBUNTU/LINUX MAKEFILE
# This makefile is used to setup and run the backend and frontend of the project. Run `make` to setup and run the backend and frontend. 
# Run `make setup_backend` to setup the backend. Run `make run_backend` to run the backend. 
# Run `make setup_frontend` to setup the frontend. Run `make run_frontend` to run the frontend.
default: setup_backend run_backend setup_frontend run_frontend

setup_backend:
	python3 -m pip install -r requirements.txt
	cd backend && python3 manage.py makemigrations && python3 manage.py migrate

run_backend:
	cd backend && python3 manage.py runserver &

setup_frontend:
	cd frontend && npm install

run_frontend:
	cd frontend && npm run dev &

.PHONY: default setup_backend run_backend setup_frontend run_frontend
