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
from selenium.common.exceptions import ElementClickInterceptedException, TimeoutException
load_dotenv()
"""
Tests inputs and renders related to the feedback page
"""

def find_and_click_text(driver, text):
    # Find all elements that contain the text "8:00 AM"
    elements = driver.find_elements(By.XPATH, f"//*[contains(text(), '{text}')]")
    
    for element in elements:
        try:
            # Try clicking each element until one works
            WebDriverWait(driver, 2).until(EC.element_to_be_clickable(element))
            element.click()
            # print(f"Clicked on element with text: {text}")
            return True
        except (ElementClickInterceptedException, TimeoutException):
            # If element is not clickable or not found within timeout, skip to the next
            continue
    print(f"No clickable element with text: {text} found.")
    return False

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
        time.sleep(3)
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

    def test_a_user_can_view_room_bookings(self):
        """Verifies that a user can successfully view column room bookings"""
        driver = self.getDriver()
        room_column = driver.find_element(By.XPATH, "//p[@class='text-lg font-bold capitalize' and text()='MEETING ROOM1']")
        time.sleep(5)
        self.assertTrue(room_column, "MEETING ROOM1 not found")
        
    def test_b_user_can_view_equipment_bookings(self):
        """Verifies that a user can successfully view column equipment bookings"""
        driver = self.getDriver()
        equipment_toggle = driver.find_element(By.XPATH, "//button[text()='Equipment']")
        equipment_toggle.click()
        # driver.set_window_size(1727, 1630)
        equipment_column = driver.find_element(By.XPATH, "//p[@class='text-lg font-bold capitalize' and text()='Laptop']")
        time.sleep(5)
        self.assertTrue(equipment_column, "Laptop not found")

    def test_c_user_can_book_room(self):
        """Verifies that a user can successfully book a room they are permitted using the (New Booking) button"""
        driver = self.getDriver()
        book_button = driver.find_element(By.XPATH, "//button[text()='New Booking']")
        book_button.click()
        title_field = driver.find_element(By.XPATH, '//input[@placeholder="Give your booking a title"]')
        title_field.send_keys("Automated Test Booking")
        asset_field = driver.find_element(By.XPATH, '//input[@placeholder="Pick an asset"]')
        asset_field.click()
        time.sleep(1)
        pick_asset = driver.find_element(By.XPATH, "//div[@role='option' and .//span[text()='MEETING ROOM1']]")
        pick_asset.click()
        calendar_field = WebDriverWait(driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='March 24, 2024']"))
        )
        calendar_field.click()
        # Change date if wanted
        date_picker = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='29 March 2024']"))
        )
        time.sleep(1)
        date_picker.click()
        from_field = driver.find_element(By.XPATH, '//input[@placeholder="from"]')
        from_field.click()
        pick_from = driver.find_element(By.XPATH, "//div[@role='option' and .//span[text()='7:00 AM']]") #:ref:
        pick_from.click()
        to_field = driver.find_element(By.XPATH, '//input[@placeholder="to"]')
        to_field.click()
        to_field.send_keys("8:00 AM")
        find_and_click_text(driver, "8:00 AM")
        submit_button = driver.find_element(By.XPATH, "//button[@type='submit'][contains(text(), 'Submit')]")
        submit_button.click()
        
        confirm_notif = WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking added", confirm_notif.text)

    def test_d_user_can_edit_room_booking(self):
        """Verifies that a user can successfully edit their own room booking"""
        driver = self.getDriver()
        ## CHANGE TO AN UPDATED DATE
        big_date = driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 24']")
        big_date.click()
        calendar_field = WebDriverWait(driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='29 March 2024']"))
        )
        time.sleep(1)
        calendar_field.click()
        back_to_big_date = driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 29']")
        back_to_big_date.click()
        booked_title = driver.find_element(By.XPATH, "//p[@class='font-bold' and text()='Automated Test Booking']")
        booked_title.click()
        time.sleep(1)
        title_field = driver.find_element(By.XPATH, '//input[@placeholder="Give your booking a title"]')
        title_field.send_keys(" Updated")
        time.sleep(1)
        edit_button = driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange modal-button') and text()='Edit']")
        edit_button.click()
        
        confirm_notif = WebDriverWait(driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking modified", confirm_notif.text)

    def test_e_user_can_delete_room_booking(self):
        """Verifies that a user can successfully delete their own room booking"""
        driver = self.getDriver()
        ## CHANGE TO AN UPDATED DATE
        big_date = driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 24']")
        big_date.click()
        calendar_field = WebDriverWait(driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='29 March 2024']"))
        )
        time.sleep(1)
        calendar_field.click()
        back_to_big_date = driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 29']")
        back_to_big_date.click()
        booked_title = driver.find_element(By.XPATH, "//p[@class='font-bold' and text()='Automated Test Booking Updated']")
        booked_title.click()
        time.sleep(1)
        delete_button = driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange modal-button') and text()='Delete']")
        delete_button.click()
        self.assertTrue(delete_button, "Delete button not found")

    def test_f_user_can_book_equipment(self):
        """Verifies that a user can successfully book a equipment they are permitted using the (Book) button"""
        driver = self.getDriver()
        equipment_toggle = driver.find_element(By.XPATH, "//button[text()='Equipment']")
        equipment_toggle.click()
        book_button = driver.find_element(By.XPATH, "//button[text()='New Booking']")
        book_button.click()
        title_field = driver.find_element(By.XPATH, '//input[@placeholder="Give your booking a title"]')
        title_field.send_keys("Automated Test Booking")
        time.sleep(1)
        asset_field = driver.find_element(By.XPATH, '//input[@placeholder="Pick an asset"]')
        asset_field.click()
        time.sleep(1)
        pick_asset = driver.find_element(By.XPATH, "//div[@role='option' and .//span[text()='Laptop']]")
        pick_asset.click()
        calendar_field = WebDriverWait(driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='March 24, 2024']"))
        )
        calendar_field.click()
        # Change date if wanted
        date_picker = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='29 March 2024']"))
        )
        time.sleep(1)
        date_picker.click()
        from_field = driver.find_element(By.XPATH, '//input[@placeholder="from"]')
        from_field.click()
        pick_from = driver.find_element(By.XPATH, "//div[@role='option' and .//span[text()='7:00 AM']]")
        pick_from.click()
        to_field = driver.find_element(By.XPATH, '//input[@placeholder="to"]')
        to_field.click()

        to_field.send_keys("8:00 AM")
        find_and_click_text(driver, "8:00 AM")

        submit_button = driver.find_element(By.XPATH, "//button[@type='submit'][contains(text(), 'Submit')]")
        submit_button.click()

        confirm_notif = WebDriverWait(driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking added", confirm_notif.text)

    def test_g_user_can_edit_equipment_booking(self):
        """Verifies that a user can successfully edit their own equipment booking"""
        driver = self.getDriver()
        driver.set_window_size(1727, 1630)
        equipment_toggle = driver.find_element(By.XPATH, "//button[text()='Equipment']")
        equipment_toggle.click()
        ## CHANGE TO AN UPDATED DATE
        big_date = driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 24']")
        big_date.click()
        calendar_field = WebDriverWait(driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='29 March 2024']"))
        )
        time.sleep(1)
        calendar_field.click()
        back_to_big_date = driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 29']")
        back_to_big_date.click()
        booked_title = driver.find_element(By.XPATH, "//p[@class='font-bold' and text()='Automated Test Booking']")
        booked_title.click()
        title_field = driver.find_element(By.XPATH, '//input[@placeholder="Give your booking a title"]')
        title_field.send_keys(" Updated")
        edit_button = driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange modal-button') and text()='Edit']")
        time.sleep(1)
        edit_button.click()
        confirm_notif = WebDriverWait(driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking modified", confirm_notif.text)

    def test_h_user_can_delete_equipment_booking(self):
        """Verifies that a user can successfully delete their own equipment booking"""
        driver = self.getDriver()
        driver.set_window_size(1727, 1630)
        equipment_toggle = driver.find_element(By.XPATH, "//button[text()='Equipment']")
        equipment_toggle.click()
        ## CHANGE TO AN UPDATED DATE
        time.sleep(1)
        big_date = driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 24']")
        big_date.click()
        calendar_field = WebDriverWait(driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='29 March 2024']"))
        )
        time.sleep(1)
        calendar_field.click()
        back_to_big_date = driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 29']")
        back_to_big_date.click()
        booked_title = driver.find_element(By.XPATH, "//p[@class='font-bold' and text()='Automated Test Booking Updated']")
        booked_title.click()
        time.sleep(1)
        delete_button = driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange modal-button') and text()='Delete']")
        delete_button.click()
        confirm_notif = WebDriverWait(driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking deleted", confirm_notif.text)

    # def tearDown(self):
    #     # Cleanup after each test method
    #     self.driver.delete_all_cookies()  # Clear cookies
    #     self.driver.quit()
        
def run():
    print("\nBookings Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()