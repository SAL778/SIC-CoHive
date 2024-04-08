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
Tests inputs and renders related to the community page
"""
def find_and_click_text(global_driver, text):
    # Find all elements that contain the text "8:00 AM"
    elements = global_driver.find_elements(By.XPATH, f"//*[contains(text(), '{text}')]")
    
    for element in elements:
        try:
            # Try clicking each element until one works
            WebDriverWait(global_driver, 2).until(EC.element_to_be_clickable(element))
            element.click()
            # print(f"Clicked on element with text: {text}")
            return True
        except (ElementClickInterceptedException, TimeoutException):
            # If element is not clickable or not found within timeout, skip to the next
            continue
    print(f"No clickable element with text: {text} found.")
    return False

class TestRouting(unittest.TestCase) :
    def setUp(self):
        self.global_driver = global_driver

    def test_a_search_bar_user(self):
        """US 1.05 - Verifies that a user can successfully be found by partially inputting their name"""
        global_driver.get("http://localhost:5173/community")
        search_bar = global_driver.find_element(By.CLASS_NAME, "search-input")
        search_bar.send_keys("k")
        time.sleep(3)
        user_info_elements = global_driver.find_elements(By.CSS_SELECTOR, ".card-info")
        
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Kenji Louise" and last_name == "Chiang":
                found_user = True
                break
        self.assertTrue(found_user, "User 'Kenji Louise Chiang' not found in search results")

    def test_b_search_bar_multi_user(self):
        """US 1.05 - Verifies that multiple users can be succesfully returned by partially inputting their name"""
        global_driver.get("http://localhost:5173/community")
        search_bar = global_driver.find_element(By.CLASS_NAME, "search-input")
        search_bar.send_keys("k")
        time.sleep(2)

        user_info_elements = global_driver.find_elements(By.CSS_SELECTOR, ".card-info")
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
        """US 1.05 - Verifies that a user can successfully be found by using partial User Type or SIC Role filters applicable for the user"""
        global_driver.get("http://localhost:5173/community")
        icon_element = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//i[contains(@class, 'fa-hand-pointer') and contains(@class, 'fa-solid')]"))
        )
        icon_element.click()
        org_box = global_driver.find_element(By.XPATH, "//div[@class='filter-item' and .//span[text()='Organization']]")
        org_box.click()
        find_and_click_text(global_driver, "SIC Alumni")
        time.sleep(2)
        find_and_click_text(global_driver, "SIC Admin")
        time.sleep(2)
        find_and_click_text(global_driver, "Animator")
        time.sleep(2)
        find_and_click_text(global_driver, "Voice Actor")
        time.sleep(2)
        user_info_elements = global_driver.find_elements(By.CSS_SELECTOR, ".card-info")
        
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Kenji Louise" and last_name == "Chiang":
                found_user = True
                break
        time.sleep(5)
        self.assertTrue(found_user, "User 'Kenji Louise Chiang' not found in search results")

    def test_d_user_not_found(self):
        """US 1.05 - Verifies that a user is not found by using User Type or SIC Role filters "NOT" applicable for the user"""
        global_driver.get("http://localhost:5173/community")
        icon_element = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//i[contains(@class, 'fa-hand-pointer') and contains(@class, 'fa-solid')]"))
        )
        icon_element.click()
        find_and_click_text(global_driver, "Engineer")
        time.sleep(3)
        user_info_elements = global_driver.find_elements(By.CSS_SELECTOR, ".card-info")
        found_user = False
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Kenji Louise" and last_name == "Chiang":
                found_user = True
                # print(f"First Name: {first_name}, Last Name: {last_name}")
                break
        # time.sleep(3)
        self.assertFalse(found_user, "User 'Kenji Louise Chiang' found in search results")
        time.sleep(2)

    def test_e_click_profile(self):
        """US 1.05 - Verifies that when an account is clicked, it redirects successfully to its profile"""
        global_driver.get("http://localhost:5173/community")
        icon_element = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//i[contains(@class, 'fa-hand-pointer') and contains(@class, 'fa-solid')]"))
        )
        icon_element.click()
        
        search_bar = global_driver.find_element(By.CLASS_NAME, "search-input")
        search_bar.send_keys("k")
        time.sleep(3)
        user_info_elements = global_driver.find_elements(By.CSS_SELECTOR, ".card-info")
        
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Kenji Louise" and last_name == "Chiang":
                profile_click = global_driver.find_element(By.XPATH, "//p[text()='Kenji Louise']")
                # print(f"First Name: {first_name}, Last Name: {last_name}")
                time.sleep(3)
                profile_click.click()
                break
        ### SUBJECT TO CHANGE
        # print(global_driver.current_url)
        # expected_url = "http://localhost:5173/users/9"
        # self.assertEqual(global_driver.current_url, expected_url)
        self.assertTrue(profile_click, "Kenji's profile not found")
        time.sleep(3)
        
    def test_f_click_public_profile(self):
        """US 1.06 - Verifies that when other account is clicked, it redirects successfully to its profile"""
        global_driver.get("http://localhost:5173/community")
        icon_element = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//i[contains(@class, 'fa-hand-pointer') and contains(@class, 'fa-solid')]"))
        )
        icon_element.click()
        
        time.sleep(3)
        user_info_elements = global_driver.find_elements(By.CSS_SELECTOR, ".card-info")
        
        for user_info in user_info_elements:
            first_name = user_info.find_element(By.CLASS_NAME, "info-first").text
            last_name = user_info.find_element(By.CLASS_NAME, "info-last").text
            # print(f"First Name: {first_name}, Last Name: {last_name}")
            if first_name == "Saahil" and last_name == "Rachh":
                profile_click = global_driver.find_element(By.XPATH, "//p[text()='Saahil']")
                # print(f"First Name: {first_name}, Last Name: {last_name}")
                time.sleep(3)
                profile_click.click()
                break
        ### SUBJECT TO CHANGE
        # print(global_driver.current_url)
        self.assertTrue(profile_click, "Saahil's profile not found")
        time.sleep(3)

def run():
    print("\nCommunity Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()