import unittest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from config import *

"""
Tests inputs and renders related to the feedback page
"""


class TestRouting(unittest.TestCase) :
    def setUp(self) -> None:
        service = Service(PATH_TO_CHROMEDRIVER)
        self.driver = webdriver.Chrome(service=service)

    def test_google_form(self):
        """Verifies that the Google Form for feedback renders in an iframe correctly when accessed from the webpage."""
        driver = self.driver
        driver.get("http://localhost:5173")
        contact_tab = driver.find_element(By.XPATH, "//p[@class='md:block' and text()='Contact']")
        contact_tab.click()
        google_form_link = "https://docs.google.com/forms/d/e/1FAIpQLSfK6d9aO-cOLS2mAmeYe7KdUHxZq9cq2i4H4mqdbrVE4dxTlw/viewform?usp=sf_link" 
        iframe = self.driver.find_element(By.TAG_NAME,'iframe')
        iframe_src = iframe.get_attribute("src")
        stripped_url = iframe_src.replace("``d=true", "")
        self.assertEqual(stripped_url, google_form_link)
        time.sleep(SLEEP_TIME)

def run():
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()