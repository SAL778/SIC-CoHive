# w24project-sic_desk_management

This is a [React](https://react.dev/) project bootstrapped with [`Vite`](https://vitejs.dev/).

## Getting Started

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
npm install
```

Followed by running the server:

```bash
npm run dev
```

The frontend environment should be up and running now. By default, the frontend uses port 5173.

You can start editing a page and watch it auto-updates as you edit the file.

## Link to the Figma Hi-Fi

https://www.figma.com/file/xd69ad9wL9y19qJo52C69T/HiFi(ve)?type=design&node-id=0%3A1&mode=design&t=o6K4PRNmJd6W9lRp-1
