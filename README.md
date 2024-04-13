# w24project-sic_desk_management

This is a [React](https://react.dev/) project bootstrapped with [`Vite`](https://vitejs.dev/).

# Link to deployed app:

https://hip-yak-solely.ngrok-free.app/

# Link to deployed backend:

https://hip-yak-solely.ngrok-free.app/api/admin

## Link to Deployment Instructions
https://docs.google.com/document/d/19VpgY7MIyyuSt4cQ3IzG-dTMuHzf5jBLVMUoVJkL1iY/edit?usp=sharing

## Link to User/Admin Manual
https://docs.google.com/document/d/1Oa9bQv77SvGOypLr1pbKWmgzSyRSiJgpj7VX67qGwj4/edit?usp=sharing

## Getting Started with Dev

First, set up the backend django server:

Make sure you have a `Virtual Environment` set up.  
Then, in the root directory:

```bash
pip install -r requirements.txt
```

Once the requirements are installed, `cd` into the backend folder called `backend`.
Make sure you are in the directory that contains the `manage.py` file.

Now, make and run the migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Now, you're all set to run the backend server. Run the following command while in the same directory:

```bash
python manage.py runserver
```

After having successfully run the django server, keep this terminal window open. By default, the backend uses port 8000.

Second, open a new terminal window.
Run the frontend development server:

`cd` into the frontend folder called `frontend`.

Install the dependencies:

```bash
npm install --legacy-peer-deps or npm install --force
```

Followed by running the development server:

```bash
npm run dev
```

The frontend environment should be up and running now. By default, the frontend uses port 5173.

You can start editing a page and watch it auto-updates as you edit the file.

## For grading:
Contact us about the credentials required for access to the Google Drive
This will need to be placed in the root of the repo

## Link to the Figma Hi-Fi

https://www.figma.com/file/xd69ad9wL9y19qJo52C69T/HiFi(ve)?type=design&node-id=0%3A1&mode=design&t=o6K4PRNmJd6W9lRp-1

## Link to the Screencast and Script
https://drive.google.com/file/d/1ULHh3e4RVCM9jR5MbIb6eY5nG-9h2GXU/view?usp=drive_link
https://docs.google.com/document/d/1iuRcsmhh4jJRmBwMwS3PFwnp3UMbBSTjmp2akgRQZag/edit?usp=sharing
