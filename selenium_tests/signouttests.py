import unittest, time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from config import confTestRunner, global_driver
from selenium.common.exceptions import ElementClickInterceptedException, TimeoutException

"""
Tests cookies after signout
"""

class TestRouting(unittest.TestCase) :
    def setUp(self):
        self.global_driver = global_driver

    def test_sign_out(self):
        """Verifies that the access token is deleted after the user signs out"""
        global_driver.get("http://localhost:5173/bookings")
        time.sleep(3)
        # Check cookie before signout
        cookie_before_signout = global_driver.get_cookie("access_token")
        # print("Cookie before signout:", cookie_before_signout)

        signout_tab = global_driver.find_element(By.XPATH, "//button[contains(@class, 'nav-item') and contains(text(), 'Sign Out')]")
        signout_tab.click()
        time.sleep(2)
        confirm_button = global_driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange') and text()='Confirm']")
        confirm_button.click()
        time.sleep(2)
        
        # Check cookie after signout
        cookie_after_signout = global_driver.get_cookie("access_token")
        print("Cookie after signout:", cookie_after_signout)
        self.assertIsNone(cookie_after_signout)

def run():
    print("\nSignout Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()