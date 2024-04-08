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
Tests inputs and renders related to the feedback page
"""


class TestRouting(unittest.TestCase) :
    def setUp(self):
        self.global_driver = global_driver

    def test_google_form(self):
        """US 6.01 7.02 - Verifies that the Google Form for feedback renders in an iframe correctly when accessed from the webpage."""
        global_driver.get("http://localhost:5173/feedback")
        time.sleep(5)
        iframe = global_driver.find_element(By.XPATH, "//iframe")
        self.assertTrue(iframe, "Feedback Form iframe not found")

def run():
    print("\nContact Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()