import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from config import *
from dotenv import load_dotenv
import os
load_dotenv()
"""
Tests inputs and renders related to the feedback page
"""

class TestProfile(unittest.TestCase) :
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

        #region OWN CCID ACCOUNT - env file needed to be reproduced for testing or hardcode entry
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

    def test_a_profile_has_profile_image(self):
        """Verifies that the profile alt-image has loaded"""
        driver = self.getDriver()
        profile_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        profile_tab.click() 
        profile_pic = WebDriverWait(driver, 3).until(
            EC.presence_of_element_located((By.XPATH, f"//img[@alt='Image of Kenji Louise']"))
        )
        self.assertTrue(profile_pic, "Profile picture not found")  

    def test_b_profile_can_add_flair_role(self):
        """Verifies that the profile can add flair roles"""
        driver = self.getDriver()
        profile_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        profile_tab.click()
        add_flair = WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "input.mantine-Input-input"))
        )       
        add_flair.click()
        time.sleep(1)
        add_flair.send_keys("Automated Flair")
        time.sleep(2)
        add_flair.send_keys(Keys.RETURN)
        check_flair = WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "span.mantine-Pill-label"))
        )
        time.sleep(1)
        self.assertTrue(check_flair, "Flair not found")

    def test_c_profile_can_delete_flair_role(self):
        """Verifies that the profile can delete flair roles"""
        driver = self.getDriver()
        profile_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        profile_tab.click()
        delete_flair = WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "mantine-Pill-remove"))
        ) 
        time.sleep(2)      
        delete_flair.click()
        time.sleep(1)
        self.assertTrue(delete_flair, "Flair still found")

    def test_d_profile_have_sic_role_present(self):
        """Verifies that the profile have sic role present"""
        driver = self.getDriver()
        profile_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        profile_tab.click()
        sic_role = WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.XPATH, "//span[contains(@class, 'm-1e0e6180') and contains(@class, 'mantine-Pill-label') and text()='User']"))
        ) 
        time.sleep(2)      
        self.assertTrue(sic_role, "Flair still found")

    def test_e_profile_can_add_item_portfolio(self):
        """Verifies that a portfolio item can be added """
        driver = self.getDriver()
        profile_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        profile_tab.click()
        add_item = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'button-orange') and text()='Add Item']"))
        )
        add_item.click()
        time.sleep(1)
        title_field = driver.find_element(By.XPATH, "//input[@placeholder='Enter a title']")
        title_field.click()
        title_field.send_keys("Automated Title")
        time.sleep(1)
        description = driver.find_element(By.XPATH, "//input[@placeholder='Enter a brief description']")
        description.click()
        description.send_keys("Automated Sample Description")
        time.sleep(1)
        link_field = driver.find_element(By.XPATH, "//input[@placeholder='Enter a link']")
        link_field.click()
        link_field.send_keys("google.com")
        time.sleep(1)
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        confirm_notif = WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Item added", confirm_notif.text)
    
    def test_f_profile_can_delete_item_portfolio(self):
        """Verifies that a portfolio item can be deleted"""
        driver = self.getDriver()
        profile_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        profile_tab.click()
        driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
        time.sleep(1)
        delete_button = driver.find_element(By.XPATH, "//button[@aria-label='Delete button']")
        driver.execute_script("arguments[0].click();", delete_button)

        delete_confirm = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'modal-button') and text()='Delete']"))
        )
        delete_confirm.click()
        confirm_notif = WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Item deleted", confirm_notif.text)

    def test_g_bio_can_edited(self):
        """Verifies that a user can edit the profile description"""
        driver = self.getDriver()
        profile_tab = driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        profile_tab.click()
        driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
        time.sleep(1)
        textarea=driver.find_element(By.CSS_SELECTOR, "p[data-placeholder='Enter a brief description']")
        textarea.click()
        time.sleep(2)
        textarea.send_keys("Automated Sample Description")
        time.sleep(2)
        save_button = driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange') and text()='Save Content']")
        save_button.click()
        time.sleep(1)
        textarea = driver.find_element(By.XPATH, "//div[@class='tiptap ProseMirror' and .//p[text()='Automated Sample Description']]")
        self.assertTrue(textarea, "Profile description not found")
        
    def tearDown(self):
        # Cleanup after each test method
        self.driver.delete_all_cookies()  # Clear cookies
        self.driver.quit()
def run():
    print("\nProfile Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestProfile)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()
    