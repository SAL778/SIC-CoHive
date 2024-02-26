import unittest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from config import *

"""
Tests intra-site navigation and routing, particularly with the sidebar.
"""

class TestRouting(unittest.TestCase) :
    def setUp(self) -> None:
        service = Service(PATH_TO_CHROMEDRIVER)
        self.driver = webdriver.Chrome(service=service)

    def test_basic_routing(self):
        """Verifies that community route does indeed correspond to the community page"""
        driver = self.driver
        driver.get("http://localhost:5173/community")
        self.assertEqual(driver.current_url, "http://localhost:5173/community")
        time.sleep(SLEEP_TIME)

    def test_community_tab_sidebar(self):
        """Verifies that the community page can be navigated to succesfully using the sidebar"""
        driver = self.driver
        driver.get("http://localhost:5173/community")
        community_tab = driver.find_element(By.XPATH, "//p[@class='md:block' and text()='Community']")
        community_tab.click()
        self.assertEqual(driver.current_url, "http://localhost:5173/community")
        time.sleep(SLEEP_TIME)

def run():
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()