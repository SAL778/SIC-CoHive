import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
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

    def test_a_search_bar_user(self):
        """Verifies that a user can successfully be found by partially inputting their name"""
        driver = self.getDriver()
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Community']")
        community_tab.click()
        search_bar = driver.find_element(By.CLASS_NAME, "search-input")
        search_bar.send_keys("k")
        time.sleep(3)
        user_info_elements = driver.find_elements(By.CSS_SELECTOR, ".card-info")
        
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Kenji Louise" and last_name == "Chiang":
                found_user = True
                break
        self.assertTrue(found_user, "User 'Kenji Louise Chiang' not found in search results")

    def test_b_search_bar_multi_user(self):
        """Verifies that multiple users can be succesfully returned by partially inputting their name"""
        driver = self.getDriver()
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Community']")
        community_tab.click()
        search_bar = driver.find_element(By.CLASS_NAME, "search-input")
        search_bar.send_keys("k")
        time.sleep(2)

        user_info_elements = driver.find_elements(By.CSS_SELECTOR, ".card-info")
        user_info_count = 0
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name.lower().startswith("k"):
                user_info_count += 1
                # print(f"First Name: {first_name}, Last Name: {last_name}")
        # print(f"Total number of user_info elements: {user_info_count}")
        self.assertTrue(user_info_count>1, "Only 1 user found in search results that starts with 'k'.")
    
    def test_c_user_sic_filter(self):
        """Verifies that a user can successfully be found by using partial User Type or SIC Role filters applicable for the user"""
        driver = self.getDriver()
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Community']")
        community_tab.click()
        org_box = driver.find_element(By.XPATH, "//div[@class='filter-item' and .//span[text()='Organization']]")
        org_box.click()
        sic_alum_box = driver.find_element(By.XPATH, "//div[@class='filter-item' and .//span[text()='SIC Alumni']]")
        sic_alum_box.click()
        sic_admin_box = driver.find_element(By.XPATH, "//div[@class='filter-item' and .//span[text()='SIC Admin']]")
        sic_admin_box.click()
        animator_box = driver.find_element(By.XPATH, "//div[@class='filter-item' and .//span[text()='Animator']]")
        animator_box.click()
        voice_box = driver.find_element(By.XPATH, "//div[@class='filter-item' and .//span[text()='Voice Actor']]")
        voice_box.click()
        engineer_box = driver.find_element(By.XPATH, "//div[@class='filter-item' and .//span[text()='Engineer']]")
        engineer_box.click()
        time.sleep(2)
        user_info_elements = driver.find_elements(By.CSS_SELECTOR, ".card-info")
        
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Kenji Louise" and last_name == "Chiang":
                found_user = True
                break
        self.assertTrue(found_user, "User 'Kenji Louise Chiang' not found in search results")

    def test_d_user_not_found(self):
        """Verifies that a user is not found by using User Type or SIC Role filters "NOT" applicable for the user"""
        driver = self.getDriver()
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Community']")
        community_tab.click()
        business_box = driver.find_element(By.XPATH, "//div[@class='filter-item' and .//span[text()='Business']]")
        business_box.click()
        time.sleep(2)
        user_info_elements = driver.find_elements(By.CSS_SELECTOR, ".card-info")
        found_user = False
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Kenji Louise" and last_name == "Chiang":
                found_user = True
                break
        self.assertFalse(found_user, "User 'Kenji Louise Chiang' found in search results")

    def test_e_click_profile(self):
        """Verifies that when an account is clicked, it redirects successfully to its profile"""
        driver = self.getDriver()
        community_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Community']")
        community_tab.click()
        driver.set_window_size(1727, 1630)
        search_bar = driver.find_element(By.CLASS_NAME, "search-input")
        search_bar.send_keys("k")
        time.sleep(3)
        user_info_elements = driver.find_elements(By.CSS_SELECTOR, ".card-info")
        
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Kenji Louise" and last_name == "Chiang":
                profile_click = driver.find_element(By.XPATH, "//p[text()='Kenji Louise']")
                # print(f"First Name: {first_name}, Last Name: {last_name}")
                time.sleep(3)
                profile_click.click()
                break
        ### SUBJECT TO CHANGE
        expected_url = "http://localhost:5173/users/9"
        self.assertEqual(driver.current_url, expected_url)

    def tearDown(self):
        # Cleanup after each test method
        self.driver.delete_all_cookies()  # Clear cookies
        self.driver.quit()    
def run():
    print("\nCommunity Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()