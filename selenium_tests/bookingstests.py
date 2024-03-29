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
from datetime import date, timedelta
#### DO NOT CHANGE
today = date.today()
month_day_year = today.strftime('%B %d, %Y') #  March 29, 2024
month_day = today.strftime('%B %d').lstrip("0")  # March 29

"""
Tests inputs and renders related to the Bookings page
"""
#### COMMENT THIS OUT IF YOU WANT TO USE YOUR OWN DATE
#### THIS LINES OF CODE CORRESPONDS TO THE TOMORROW'S DATE
tomorrow = today + timedelta(days=1)
target_day_month_year = tomorrow.strftime('%d %B %Y') #  e.g. 29 March 2024
target_month_day = tomorrow.strftime('%B %d').lstrip("0")  # e.g. March 29
#### CHANGE TO DESIRED BOOKING DATE, DIRECTLY CORRESPONDS TO THE DATE PICKER,
#### SO IF DATE ENTERED IS OUTSIDE THE CURRENT MONTH, THEN IT WILL GIVE YOU AN ERROR THAT IT CANNOT FIND THE ELEMENT
#### SINCE YOU HAVE TO CLICK SOMETHING TO GO TO THE NEXT MONTH/S IN THE DATE PICKER, WHICH I DID NOT INCLUDE IN THIS TEST.
#### e.g. IF CURRENTLY ITS THE MONTH OF MARCH, AND YOU ENTER A DATE IN APRIL, IT WILL NOT WORK.
#### IF NO BOOKING DATE DESIRED THEN YOU CAN TRY TO USE THE TOMORROW VARIABLES ABOVE
#### COMMENT THIS OUT IF YOU WANT TO USE TOMORROW'S DATE
# target_day_month_year = "29 March 2024"
# target_month_day = "March 29"



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

class TestBookings(unittest.TestCase) :
    def setUp(self):
        self.global_driver = global_driver

    def test_a_user_can_view_room_bookings(self):
        """Verifies that a user can successfully view column room bookings"""
        global_driver.get("http://localhost:5173/bookings")
        time.sleep(3)
        room_column = global_driver.find_element(By.XPATH, "//p[text()='MEETING ROOM1']")
        time.sleep(3)
        self.assertTrue(room_column, "MEETING ROOM1 not found")
        
    def test_b_user_can_view_equipment_bookings(self):
        """Verifies that a user can successfully view column equipment bookings"""
        global_driver.get("http://localhost:5173/bookings")
        global_driver.set_window_size(1727, 1630)
        equipment_toggle = global_driver.find_element(By.XPATH, "//button[.//p[text()='Equipment']]")
        equipment_toggle.click()
        time.sleep(2)
        equipment_column = global_driver.find_element(By.XPATH, "//p[text()='Laptop']")
        time.sleep(3)
        self.assertTrue(equipment_column, "Laptop not found")

    def test_c_user_can_book_room(self):
        """Verifies that a user can successfully book a room they are permitted using the (New Booking) button"""
        global_driver.get("http://localhost:5173/bookings")
        book_button = global_driver.find_element(By.XPATH, "//button[text()='New Booking']")
        book_button.click()
        time.sleep(3)
        title_field = global_driver.find_element(By.XPATH, '//input[@placeholder="Give your booking a title"]')
        title_field.send_keys("Automated Test Booking")
        time.sleep(3)
        asset_field = global_driver.find_element(By.XPATH, '//input[@placeholder="Pick an asset"]')
        asset_field.click()
        time.sleep(3)
        pick_asset = global_driver.find_element(By.XPATH, "//div[@role='option' and .//span[text()='MEETING ROOM1']]")
        pick_asset.click()
        calendar_field = WebDriverWait(global_driver, 3).until(
            
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{month_day_year}']"))
        )
        calendar_field.click()
        # Change date if wanted
        date_picker = WebDriverWait(global_driver, 3).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, F"button[aria-label='{target_day_month_year}']"))
        )
        time.sleep(3)
        date_picker.click()
        from_field = global_driver.find_element(By.XPATH, '//input[@placeholder="from"]')
        from_field.click()
        pick_from = global_driver.find_element(By.XPATH, "//div[@role='option' and .//span[text()='7:00 AM']]")
        time.sleep(3)
        pick_from.click()
        to_field = global_driver.find_element(By.XPATH, '//input[@placeholder="to"]')
        to_field.click()
        to_field.send_keys("8:00 AM")
        find_and_click_text(global_driver, "8:00 AM")
        submit_button = global_driver.find_element(By.XPATH, "//button[@type='submit'][contains(text(), 'Submit')]")
        time.sleep(2)
        submit_button.click()
        confirm_notif = WebDriverWait(global_driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        # confirm_notif = global_driver.find_element(By.CLASS_NAME, 'mantine-Notification-title')
        self.assertIn("Booking added", confirm_notif.text)
        time.sleep(3)

    def test_d_user_can_view_room_booking_list(self):
        """Verifies that a user can successfully view their own room booking in list view"""
        global_driver.get("http://localhost:5173/bookings")
        time.sleep(3)
        ## CHANGE TO AN UPDATED DATE
        big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{month_day}']")
        big_date.click()
        calendar_field = WebDriverWait(global_driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{target_day_month_year}']"))
        )
        time.sleep(3)
        calendar_field.click()
        back_to_big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{target_month_day}']")
        time.sleep(2)
        back_to_big_date.click()
        time.sleep(3)   
        icon = WebDriverWait(global_driver, 3).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "fa-th-list"))
        )
        icon.click()
        time.sleep(3)
        find_and_click_text(global_driver, "My Bookings")
        time.sleep(3)
        booked_title = global_driver.find_element(By.XPATH, "//p[@class='text-for-mobile font-regular' and text()='Automated Test Booking']")
        time.sleep(3)
        self.assertTrue(booked_title, "Booking is present in list view")

    def test_e_user_can_edit_room_booking(self):
        """Verifies that a user can successfully edit their own room booking"""
        global_driver.get("http://localhost:5173/bookings")
        time.sleep(3)
        ## CHANGE TO AN UPDATED DATE
        big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{month_day}']")
        big_date.click()
        calendar_field = WebDriverWait(global_driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{target_day_month_year}']"))
        )
        time.sleep(3)
        calendar_field.click()
        back_to_big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{target_month_day}']")
        time.sleep(2)
        back_to_big_date.click()
        booked_title = global_driver.find_element(By.XPATH, "//p[@class='font-bold' and text()='Automated Test Booking']")
        time.sleep(3)
        booked_title.click()
        time.sleep(3)
        title_field = global_driver.find_element(By.XPATH, '//input[@placeholder="Give your booking a title"]')
        title_field.send_keys(" Updated")
        time.sleep(3)
        edit_button = global_driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange modal-button') and text()='Edit']")
        edit_button.click()
        
        confirm_notif = WebDriverWait(global_driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking modified", confirm_notif.text)

    def test_f_user_can_delete_room_booking(self):
        """Verifies that a user can successfully delete their own room booking"""
        global_driver.get("http://localhost:5173/bookings")
        ## CHANGE TO AN UPDATED DATE
        big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{month_day}']")
        big_date.click()
        calendar_field = WebDriverWait(global_driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{target_day_month_year}']"))
        )
        time.sleep(3)
        calendar_field.click()
        back_to_big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{target_month_day}']")
        back_to_big_date.click()
        booked_title = global_driver.find_element(By.XPATH, "//p[@class='font-bold' and text()='Automated Test Booking Updated']")
        booked_title.click()
        time.sleep(3)
        delete_button = global_driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange modal-button') and text()='Delete']")
        delete_button.click()
        # time.sleep(3)
        # self.assertTrue(delete_button, "Delete button not found")
        confirm_notif = WebDriverWait(global_driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking deleted", confirm_notif.text)
        time.sleep(3)

    def test_g_user_can_book_equipment(self):
        """Verifies that a user can successfully book a equipment they are permitted using the (Book) button"""
        global_driver.get("http://localhost:5173/bookings")
        time.sleep(2)
        equipment_toggle = global_driver.find_element(By.XPATH, "//button[.//p[text()='Equipment']]")
        equipment_toggle.click()
        book_button = global_driver.find_element(By.XPATH, "//button[text()='New Booking']")
        time.sleep(3)
        book_button.click()
        title_field = global_driver.find_element(By.XPATH, '//input[@placeholder="Give your booking a title"]')
        title_field.send_keys("Automated Test Booking")
        time.sleep(3)
        asset_field = global_driver.find_element(By.XPATH, '//input[@placeholder="Pick an asset"]')
        asset_field.click()
        time.sleep(3)
        pick_asset = global_driver.find_element(By.XPATH, "//div[@role='option' and .//span[text()='Laptop']]")
        pick_asset.click()
        calendar_field = WebDriverWait(global_driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{month_day_year}']"))
        )
        calendar_field.click()
        # Change date if wanted
        date_picker = WebDriverWait(global_driver, 3).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{target_day_month_year}']"))
        )
        date_picker.click()
        from_field = global_driver.find_element(By.XPATH, '//input[@placeholder="from"]')
        from_field.click()
        pick_from = global_driver.find_element(By.XPATH, "//div[@role='option' and .//span[text()='7:00 AM']]")
        time.sleep(3)
        pick_from.click()
        to_field = global_driver.find_element(By.XPATH, '//input[@placeholder="to"]')
        to_field.click()
        to_field.send_keys("8:00 AM")
        find_and_click_text(global_driver, "8:00 AM")

        submit_button = global_driver.find_element(By.XPATH, "//button[@type='submit'][contains(text(), 'Submit')]")
        time.sleep(2)
        submit_button.click()
        
        confirm_notif = WebDriverWait(global_driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking added", confirm_notif.text)
        time.sleep(3)

    def test_h_user_can_view_equipment_booking_list(self):
        """Verifies that a user can successfully view their own equipment booking in list view"""
        global_driver.get("http://localhost:5173/bookings")
        time.sleep(2)
        equipment_toggle = global_driver.find_element(By.XPATH, "//button[.//p[text()='Equipment']]")
        equipment_toggle.click()
        time.sleep(2)
        ## CHANGE TO AN UPDATED DATE
        big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{month_day}']")
        big_date.click()
        time.sleep(2)
        calendar_field = WebDriverWait(global_driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{target_day_month_year}']"))
        )
        time.sleep(3)
        calendar_field.click()
        back_to_big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{target_month_day}']")
        back_to_big_date.click()
        time.sleep(3)   
        icon = WebDriverWait(global_driver, 3).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "fa-th-list"))
        )
        icon.click()
        time.sleep(3)
        find_and_click_text(global_driver, "My Bookings")
        time.sleep(3)
        booked_title = global_driver.find_element(By.XPATH, "//p[@class='text-for-mobile font-regular' and text()='Automated Test Booking']")
        time.sleep(3)
        self.assertTrue(booked_title, "Booking is present in list view")

    def test_i_user_can_edit_equipment_booking(self):
        """Verifies that a user can successfully edit their own equipment booking"""
        global_driver.get("http://localhost:5173/bookings")
        global_driver.set_window_size(1727, 1630)
        time.sleep(2)
        equipment_toggle = global_driver.find_element(By.XPATH, "//button[.//p[text()='Equipment']]")
        equipment_toggle.click()
        time.sleep(3)
        ## CHANGE TO AN UPDATED DATE
        big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{month_day}']")
        time.sleep(3)
        big_date.click()
        calendar_field = WebDriverWait(global_driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{target_day_month_year}']"))
        )
        time.sleep(2)
        calendar_field.click()
        back_to_big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{target_month_day}']")
        time.sleep(2)
        back_to_big_date.click()
        booked_title = global_driver.find_element(By.XPATH, "//p[@class='font-bold' and text()='Automated Test Booking']")
        time.sleep(3)
        booked_title.click()
        title_field = global_driver.find_element(By.XPATH, '//input[@placeholder="Give your booking a title"]')
        time.sleep(3)
        title_field.send_keys(" Updated")
        edit_button = global_driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange modal-button') and text()='Edit']")
        time.sleep(3)
        edit_button.click()
        confirm_notif = WebDriverWait(global_driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking modified", confirm_notif.text)
        time.sleep(3)
        
    def test_j_user_can_delete_equipment_booking(self):
        """Verifies that a user can successfully delete their own equipment booking"""
        global_driver.get("http://localhost:5173/bookings")
        global_driver.set_window_size(1727, 1630)
        equipment_toggle = global_driver.find_element(By.XPATH, "//button[.//p[text()='Equipment']]")
        time.sleep(3)
        equipment_toggle.click()
        ## CHANGE TO AN UPDATED DATE
        big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{month_day}']")
        big_date.click()
        calendar_field = WebDriverWait(global_driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[aria-label='{target_day_month_year}']"))
        )
        time.sleep(2)
        calendar_field.click()
        back_to_big_date = global_driver.find_element(By.XPATH, f"//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='{target_month_day}']")
        time.sleep(3)
        back_to_big_date.click()
        booked_title = global_driver.find_element(By.XPATH, "//p[@class='font-bold' and text()='Automated Test Booking Updated']")
        booked_title.click()
        time.sleep(3)
        delete_button = global_driver.find_element(By.XPATH, "//button[contains(@class, 'button-orange modal-button') and text()='Delete']")
        delete_button.click()
        confirm_notif = WebDriverWait(global_driver, 1).until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'mantine-Notification-title'))
        )
        self.assertIn("Booking deleted", confirm_notif.text)
        time.sleep(3)

def run():
    print("\nBookings Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestBookings)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()