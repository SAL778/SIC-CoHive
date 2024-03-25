import unittest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config import *
from dotenv import load_dotenv
import os
load_dotenv()
"""
Tests inputs and renders related to the feedback page
"""

class TestRouting(unittest.TestCase) :
    def setUp(self) -> None:
        service = Service(PATH_TO_CHROMEDRIVER)
        self.driver = webdriver.Chrome(service=service)

    def getDriver(self):
        email = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")
        driver = self.driver
        # Store the original window handle
        original_window = driver.current_window_handle
        driver.get("http://localhost:5173") 

        sign_in = driver.find_element(By.CLASS_NAME, "nsm7Bb-HzV7m-LgbsSe-BPrWId")
        sign_in.click()

        # Wait for the iframe to be present and switch to it
        WebDriverWait(driver, 3).until(
            EC.frame_to_be_available_and_switch_to_it((By.XPATH, "//iframe[contains(@src, 'accounts.google.com/gsi/button')]"))
        )

        # Switching to the pop-up
        WebDriverWait(driver, 3).until(EC.number_of_windows_to_be(2))
        windows = driver.window_handles
        driver.switch_to.window(windows[1])

        email_field = driver.find_element(By.ID, 'identifierId')
        email_field.send_keys(email)
        # time.sleep(3)
        next_button = driver.find_element(By.ID, 'identifierNext')
        next_button.click()

        WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.NAME, 'username'))
        )
        username = driver.find_element(By.NAME, 'username')

        #region KENJI OWN CCID ACCOUNT - TO BE DELETED AND REPLACED
        username.send_keys(email)
        password_field = driver.find_element(By.NAME, 'password')
        password_field.send_keys(password)
        #endregion

        login_eClass = driver.find_element(By.CSS_SELECTOR, '.btn.btn-green')
        login_eClass.click()
        time.sleep(3)

        second_continue = driver.find_element(By.XPATH, "//*[text()='Continue']")
        second_continue.click()
        time.sleep(3)
        
        second_google = driver.find_element(By.CLASS_NAME, "fFW7wc-ibnC6b-K4efff")
        second_google.click()
        time.sleep(3)

        # After the pop-up closes and you're redirected, switch back to the original window
        driver.switch_to.window(original_window)
        return self.driver

    def test_google_form(self):
        """Verifies that the access token is deleted after the user signs out"""
        driver = self.getDriver()
        time.sleep(3)
        # Check cookie before signout
        cookie_before_signout = driver.get_cookie("access_token")
        # print("Cookie before signout:", cookie_before_signout)

        signout_tab = driver.find_element(By.XPATH, "//button[contains(@class, 'nav-item') and contains(text(), 'Sign Out')]")
        signout_tab.click()
        time.sleep(2)
        confirm_button = driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange') and text()='Confirm']")
        confirm_button.click()
        time.sleep(2)
        
        # Check cookie after signout
        cookie_after_signout = driver.get_cookie("access_token")
        print("Cookie after signout:", cookie_after_signout)
        self.assertIsNone(cookie_after_signout)

    def tearDown(self):
        # Cleanup after each test method
        self.driver.delete_all_cookies()  # Clear cookies
        self.driver.quit()
def run():
    print("\nSignout Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()