import unittest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from config import *

"""
Tests inputs and renders related to the feedback page
"""

class TestProfile(unittest.TestCase) :
    def setUp(self) -> None:
        service = Service(PATH_TO_CHROMEDRIVER)
        self.driver = webdriver.Chrome(service=service)

    def test_profile_has_profile_image(self):
        """Verifies that the profile image has loaded"""
        driver = self.driver
        driver.get(ADDRESS + "/profile")
        profile_picture = driver.find_element(By.CLASS_NAME, 'profileImg')
        src_attribute = profile_picture.get_attribute("src")
        assert src_attribute != None
        # time.sleep(SLEEP_TIME)

    def test_bio_cannot_be_edited_without_button_toggle(self):
        """Verifies that a user cannot edit the profile without clicking the edit button"""
        driver = self.driver
        driver.get(ADDRESS + "/profile")
        textarea = driver.find_element(By.CLASS_NAME, "aboutText")
        textarea.click()
        
        textAreaText = ("This should not be typed in")
        typed = textarea.get_attribute("value")

        assert("This should not be typed in" not in typed)

    def test_bio_can_be_edited_with_button_toggle(self):
        """Verifies that a user can edit their about section if they click the edit button"""
        driver = self.driver
        driver.get(ADDRESS + "/profile")
        editButton = driver.find_element(By.CLASS_NAME, "aboutEditButton")
        editButton.click()

        textarea = driver.find_element(By.CLASS_NAME, "aboutText")
        textarea.click()
        textarea.send_keys("This should be typed in")
        
        typed = textarea.get_attribute("value")

        assert("This should be typed in" in typed)


    def test_bio_text_can_be_discarded(self):
        """Verifies that a user can discard their typed text by clicking the delete button"""
        driver = self.driver
        driver.get(ADDRESS + "/profile")
        editButton = driver.find_element(By.CLASS_NAME, "aboutEditButton")
        editButton.click()

        textarea = driver.find_element(By.CLASS_NAME, "aboutText")
        textarea.click()

        textarea.send_keys("This should be discarded")
        cancelButton = driver.find_element(By.CLASS_NAME, "aboutCancelButton")
        cancelButton.click()

        typed = textarea.get_attribute("value")
        assert("This should be discarded" not in typed)

    def test_portfolio_can_be_deleted(self):
        """Verifies that a portfolio item can be deleted """
        driver = self.driver
        driver.get(ADDRESS + "/profile")
        deleteButton = driver.find_element(By.XPATH, "//h3[text()='React App'] | //p[text()='Made with Vite and Bootstrap'] | //button[@aria-label='Delete button']")
        deleteButton.click()

        deleteConfirmButton = driver.find_element(By.CLASS_NAME, "submitDeleteItem")
        deleteConfirmButton.click()
        driver.implicitly_wait(3)
        assert(not deleteButton)
        # time.sleep(SLEEP_TIME)

def run():
    test = unittest.TestLoader().loadTestsFromTestCase(TestProfile)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()
    