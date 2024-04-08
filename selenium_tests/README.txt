Selenium with Python

To verify correct installation try to run smoketest.py. You should get "Recieved!" on correct install.

Change config.py with the path to your chromedriver before beginning if needed.
Also, double check the localhost url link as well if it matches.

Make sure you included accessType roles specifically for booking MEETING ROOM1(Room) and LAPTOP(Equipment)
Double check by going to localhost first if the said resources can be booked.

Create .env file, having the first 2 lines like this:
USERNAME=youremail@ualberta.ca
PASSWORD=yourpassword

READ COMMENTS IN BOOKINGSTESTS FIRST BEFORE TESTINGS
REMOVE ANY WRITTEN BIO/DESCRIPTION IN PROFILE
Lastly, if anything fails, it will be most probably because of the difference in the database
or that it is looking for elements specifically my details, such as ("Kenji ...") or etc.

You need both backend and frontend running before running scripts
-> frontend:    npm install
                npm run dev

-> backend:     python3 manage.py runserver 

Run all tests via runtests.py