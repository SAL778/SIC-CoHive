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
        """Verifies that the Google Form for feedback renders in an iframe correctly when accessed from the webpage."""
        global_driver.get("http://localhost:5173/feedback")
        time.sleep(3)
        google_form_link = "https://docs.google.com/forms/d/e/1FAIpQLSfK6d9aO-cOLS2mAmeYe7KdUHxZq9cq2i4H4mqdbrVE4dxTlw/viewform?usp=sf_link" 
        iframe = self.global_driver.find_element(By.TAG_NAME,'iframe')
        iframe_src = iframe.get_attribute("src")
        stripped_url = iframe_src.replace("``d=true", "")
        self.assertEqual(stripped_url, google_form_link)

def run():
    print("\nContact Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()