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
Tests intra-site navigation and routing, particularly with the sidebar.
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

    def tearDown(self):
        # Cleanup after each test method
        self.driver.delete_all_cookies()  # Clear cookies
        self.driver.quit()


    def test_a_bookings_tab_sidebar(self):
        """Verifies that the bookings page can be navigated to succesfully using the sidebar"""
        driver = self.getDriver()
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Bookings']")
        community_tab.click()
        self.assertEqual(driver.current_url, "http://localhost:5173/bookings")

    def test_b_events_tab_sidebar(self):
        """Verifies that the events page can be navigated to succesfully using the sidebar"""
        driver = self.getDriver()
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Events']")
        community_tab.click()
        self.assertEqual(driver.current_url, "http://localhost:5173/events")

    def test_c_community_tab_sidebar(self):
        """Verifies that the community page can be navigated to succesfully using the sidebar"""
        driver = self.getDriver()
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Community']")
        community_tab.click()
        self.assertEqual(driver.current_url, "http://localhost:5173/community")

    def test_c_statistics_tab_sidebar(self):
        """Verifies that the statistics page can be navigated to succesfully using the sidebar"""
        driver = self.getDriver()
        # driver.get("http://localhost:5173/statistics")
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Statistics']")
        community_tab.click()
        self.assertEqual(driver.current_url, "http://localhost:5173/statistics")

    def test_d_statistics_tab_sidebar(self):
        """Verifies that the profile page can be navigated to succesfully using the sidebar"""
        driver = self.getDriver()
        # driver.get("http://localhost:5173/profile")
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        community_tab.click()
        self.assertEqual(driver.current_url, "http://localhost:5173/profile")

    def test_e_statistics_tab_sidebar(self):
        """Verifies that the feedback page can be navigated to succesfully using the sidebar"""
        driver = self.getDriver()
        # driver.get("http://localhost:5173/feedback")
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Contact']")
        community_tab.click()
        self.assertEqual(driver.current_url, "http://localhost:5173/feedback")

    def tearDown(self):
        # Cleanup after each test method
        self.driver.delete_all_cookies()  # Clear cookies
        self.driver.quit()
def run():
    print("\nNavbar Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()