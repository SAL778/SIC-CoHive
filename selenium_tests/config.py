import os, time, unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dotenv import load_dotenv

# Assuming your environment variables are set for USERNAME and PASSWORD
load_dotenv()

PATH_TO_CHROMEDRIVER = "/usr/local/bin/chromedriver"  # Update as needed
global_driver = None

def global_login():
    email = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")
    global_driver.set_window_size(1727, 1630)
    global_driver.get("http://localhost:5173/")  # Adjust URL as necessary
    
    # Add your Google sign-in logic here, using global_driver instead of global_driver
    # For example:
    original_window = global_driver.current_window_handle
    sign_in = global_driver.find_element(By.CLASS_NAME, "nsm7Bb-HzV7m-LgbsSe-BPrWId")
    sign_in.click()

    # Wait for the iframe to be present and switch to it
    WebDriverWait(global_driver, 3).until(
        EC.frame_to_be_available_and_switch_to_it((By.XPATH, "//iframe[contains(@src, 'accounts.google.com/gsi/button')]"))
    )

    # Switching to the pop-up
    WebDriverWait(global_driver, 3).until(EC.number_of_windows_to_be(2))
    windows = global_driver.window_handles
    global_driver.switch_to.window(windows[1])

    email_field = global_driver.find_element(By.ID, 'identifierId')
    email_field.send_keys(email)
    next_button = global_driver.find_element(By.ID, 'identifierNext')
    next_button.click()

    WebDriverWait(global_driver, 3).until(
        EC.visibility_of_element_located((By.NAME, 'username'))
    )
    username = global_driver.find_element(By.NAME, 'username')

    username.send_keys(email)
    password_field = global_driver.find_element(By.NAME, 'password')
    password_field.send_keys(password)

    login_eClass = global_driver.find_element(By.CSS_SELECTOR, '.btn.btn-green')
    login_eClass.click()
    time.sleep(3)

    second_continue = global_driver.find_element(By.XPATH, "//*[text()='Continue']")
    second_continue.click()
    time.sleep(3)
    
    second_google = global_driver.find_element(By.CLASS_NAME, "fFW7wc-ibnC6b-K4efff")
    second_google.click()
    time.sleep(3)

    # After the pop-up closes and you're redirected, switch back to the original window
    global_driver.switch_to.window(original_window)

def global_setup():
    global global_driver
    service = Service(PATH_TO_CHROMEDRIVER)
    global_driver = webdriver.Chrome(service=service)
    global_login()  # Perform the login

def global_teardown():
    if global_driver:
        global_driver.quit()

#What it says on success
#test.shortDescription() is whatever you place in the docstrings of the defined function
class confTestResult(unittest.TextTestResult):
    def addSuccess(self, test):
        super().addSuccess(test)
        self.stream.writeln("Success - {}".format(test.shortDescription())) 

    def addError(self, test, err):
        super().addError(test, err)
        self.stream.writeln("Error - {}".format(test.shortDescription())) #Change this to possibly run error message

#This runs prints our custom test messages
class confTestRunner(unittest.TextTestRunner):
    resultclass = confTestResult