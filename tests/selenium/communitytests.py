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

    def test_search_bar(self):
        """Verifies that a user can successfully be found by partially inputting their name"""
        driver = self.driver
        driver.get("http://localhost:5173")
        community_tab = driver.find_element(By.XPATH, "//p[@class='md:block' and text()='Community']")
        community_tab.click()
        search_bar = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Search users...']")
        search_bar.send_keys("Sa")
        time.sleep(3)
        user_info_elements = driver.find_elements(By.CSS_SELECTOR, ".card-info")
        
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Saahil" and last_name == "Rachh":
                found_user = True
                break
        self.assertTrue(found_user, "User 'Saahil Rachh' not found in search results")

    def test_search_profile(self):
        """Verifies that multiple users can be succesfully returned by partially inputting their name"""
        driver = self.driver
        driver.get("http://localhost:5173")
        community_tab = driver.find_element(By.XPATH, "//p[@class='md:block' and text()='Community']")
        community_tab.click()
        search_bar = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Search users...']")
        search_bar.send_keys("Sa")
        time.sleep(3)
        user_info_elements = driver.find_element(By.CLASS_NAME, "card-info")
        user_info_elements.click()

        expected_url = "http://localhost:5173/users/4"
        self.assertEqual(driver.current_url, expected_url)
        time.sleep(3)
    
def run():
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()