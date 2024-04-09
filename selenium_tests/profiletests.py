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
Tests inputs and renders related to the profile page
"""

host = "http://localhost:5173"

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

class TestProfile(unittest.TestCase) :
    def setUp(self):
        self.global_driver = global_driver

    # def test_a_profile_has_profile_image(self):
    #     """Verifies that the profile alt-image has loaded"""
    #     global_driver.get("http://localhost:5173/profile")
    #     profile_pic = WebDriverWait(global_driver, 4).until(
    #         EC.presence_of_element_located((By.XPATH, f"//img[@alt='Image of Kenji Louise']"))
    #     )
    #     self.assertTrue(profile_pic, "Profile picture not found")  

    def test_b_profile_can_add_flair_role(self):
        """US 1.02 - Verifies that the profile can add flair roles"""
        global_driver.get(f"{host}/profile")
        add_flair = WebDriverWait(global_driver, 3).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "input.mantine-Input-input"))
        )       
        add_flair.click()
        time.sleep(2)
        add_flair.send_keys("Automated Flair")
        time.sleep(2)
        add_flair.send_keys(Keys.RETURN)
        check_flair = WebDriverWait(global_driver, 3).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "span.mantine-Pill-label"))
        )
        self.assertTrue(check_flair, "Flair not found")
        time.sleep(2)

    def test_c_profile_can_delete_flair_role(self):
        """US 1.02 - Verifies that the profile can delete flair roles"""
        global_driver.get(f"{host}/profile")
        delete_flair = WebDriverWait(global_driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "mantine-Pill-remove"))
        ) 
        time.sleep(2)      
        delete_flair.click()
        self.assertTrue(delete_flair, "Flair still found")
        time.sleep(3)

    def test_d_profile_have_sic_role_present(self):
        """US 1.02 - Verifies that the profile have USER sic role present"""
        global_driver.get(f"{host}/profile")
        sic_role = WebDriverWait(global_driver, 3).until(
            EC.visibility_of_element_located((By.XPATH, "//span[text()='User']"))
        ) 
        self.assertTrue(sic_role, "SIC role found")
        time.sleep(3)      

    def test_e_profile_can_add_item_portfolio(self):
        """US 1.04 - Verifies that a portfolio item can be added """
        global_driver.get(f"{host}/profile")
        add_item = WebDriverWait(global_driver, 3).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'button-orange') and text()='Add Item']"))
        )
        add_item.click()
        time.sleep(2)
        title_field = global_driver.find_element(By.XPATH, "//input[@placeholder='Enter a title']")
        title_field.click()
        time.sleep(3)
        title_field.send_keys("Automated Title")
        description = global_driver.find_element(By.XPATH, "//input[@placeholder='Enter a brief description']")
        description.click()
        time.sleep(3)
        description.send_keys("Automated Sample Description")
        link_field = global_driver.find_element(By.XPATH, "//input[@placeholder='Enter a link']")
        link_field.click()
        time.sleep(3)
        link_field.send_keys("google.com")
        submit_button = global_driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        confirm_notif = WebDriverWait(global_driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Item added", confirm_notif.text)
    
    def test_f_profile_can_delete_item_portfolio(self):
        """US 1.04 - Verifies that a portfolio item can be deleted"""
        global_driver.get(f"{host}/profile")
        global_driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
        time.sleep(3)
        delete_button = global_driver.find_element(By.XPATH, "//button[@aria-label='Delete button']")
        global_driver.execute_script("arguments[0].click();", delete_button)

        delete_confirm = WebDriverWait(global_driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'modal-button') and text()='Delete']"))
        )
        time.sleep(3)
        delete_confirm.click()
        confirm_notif = WebDriverWait(global_driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Item deleted", confirm_notif.text)
        time.sleep(3)

    def test_g_bio_can_edited(self):
        """Verifies that a user can edit the profile description"""
        global_driver.get(f"{host}/profile")
        global_driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
        time.sleep(2)
        textarea=global_driver.find_element(By.CSS_SELECTOR, "p[data-placeholder='Enter a brief description']")
        textarea.click()
        time.sleep(2)
        textarea.send_keys("Automated Sample Description")
        time.sleep(2)
        save_button = global_driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange') and text()='Save Content']")
        save_button.click()
        time.sleep(2)
        textarea = global_driver.find_element(By.XPATH, "//div[@class='tiptap ProseMirror' and .//p[text()='Automated Sample Description']]")
        self.assertTrue(textarea, "Profile description not found")
        time.sleep(2)

    def test_h_bio_can_deleted(self):
        """Verifies that a user can delete the profile description"""
        global_driver.get(f"{host}/profile")
        global_driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
        time.sleep(2)
        textarea = global_driver.find_element(By.CLASS_NAME, "ProseMirror")
        textarea.click()
        time.sleep(3)
        textarea.clear()
        time.sleep(2)
        save_button = global_driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange') and text()='Save Content']")
        time.sleep(2)
        save_button.click()
        confirm_notif = WebDriverWait(global_driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Saved", confirm_notif.text)
        time.sleep(2)
           
def run():
    print("\nProfile Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestProfile)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()
    