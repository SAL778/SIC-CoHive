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
Tests inputs and renders related to the events page
"""

class TestRouting(unittest.TestCase) :
    def setUp(self):
        self.global_driver = global_driver

    def test_a_google_calendar(self):
        """Verifies that the Google Calendar for events renders in an iframe correctly when accessed from the webpage."""
        global_driver.get("http://localhost:5173/events")
        time.sleep(2)
        google_form_link = "https://embed.styledcalendar.com/#QsoYY1jHXbqoa6iOHxZi" 
        iframe = self.global_driver.find_element(By.TAG_NAME,'iframe')
        iframe_src = iframe.get_attribute("src")
        stripped_url = iframe_src.replace("``d=true", "")
        time.sleep(2)
        self.assertEqual(stripped_url, google_form_link)

    def test_b_google_calendar_details(self):
        """Verifies that the events in Google Calendar shows the details when accessed from the webpage."""
        global_driver.get("http://localhost:5173/events")
        time.sleep(1)
        global_driver.switch_to.frame(global_driver.find_element(By.TAG_NAME, "iframe"))
        event_link = global_driver.find_element(By.XPATH, "//a[contains(@class, 'fc-daygrid-event') and .//div[@class='fc-event-time' and text()='1p'] and .//div[@class='fc-event-title' and text()='meet again test']]")
        time.sleep(3)
        event_link.click()
        # time.sleep(3)
        event_title = WebDriverWait(global_driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-cy='event-title']"))
        )
        # CHECK IF EVENT IS PRESENT BEFORE RUNNING
        self.assertEqual(event_title.text, "meet again test")
        time.sleep(3)

    def test_c_google_calendar_live_update(self):
        """Verifies that the events in Google Calendar shows live updates when accessed from the webpage."""
        global_driver.get("http://localhost:5173/events")
        time.sleep(2)
        global_driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
        time.sleep(1)
        global_driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
        big_date = global_driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 27']")
        big_date.click()
        calendar_field = WebDriverWait(global_driver, 3).until(
            # UPDATE TO TODAYS DATE TO WORK
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='21 March 2024']"))
        )
        time.sleep(3)
        calendar_field.click()
        back_to_big_date = global_driver.find_element(By.XPATH, "//span[contains(@class, 'text-3xl font-bold text-orange-600 mr-2') and text()='March 21']")
        time.sleep(3)
        back_to_big_date.click()
        
        live_det = WebDriverWait(global_driver, 2).until(
            EC.presence_of_element_located((By.XPATH, "//h3[contains(@class, 'large-text-mobile font-semibold capitalize leading-[1]') and contains(text(), 'meet again test')]"))
        )
        self.assertTrue(live_det, "Live update not working")
        time.sleep(2)

    def test_d_events_carousel(self):
        """Verifies that the events carousel shows up from the webpage."""
        global_driver.get("http://localhost:5173/events")
        time.sleep(2)
        title = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(@class, 'title') and contains(text(), 'SIC Birthday!')]"))
        )
        # print(title.text)
        self.assertTrue(title, "Events carousel not showing up")
        time.sleep(3)

    def test_e_events_carousel(self):
        """Verifies that the events carousel can be accessed and viewed for further details."""
        global_driver.get("http://localhost:5173/events")
        time.sleep(2)
        title = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(@class, 'title') and contains(text(), 'SIC Birthday!')]"))
        )
        title.click()
        details = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//p[contains(@class, 'mt-10') and contains(text(), 'test')]"))
        )
        
        self.assertTrue(details, "Events carousel not accessible")
        time.sleep(3)

    def test_f_events_carousel(self):
        """Verifies that the submit an event form can be accessed."""
        global_driver.get("http://localhost:5173/events")
        time.sleep(2)
        original_window = global_driver.current_window_handle
        submit = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Submit an Event']"))
        )
        submit.click()
        time.sleep(5)
        WebDriverWait(global_driver, 10).until(EC.number_of_windows_to_be(2))

        for window_handle in global_driver.window_handles:
            if window_handle != original_window:
                global_driver.switch_to.window(window_handle)
                break

        form_title = WebDriverWait(global_driver, 2).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Event Submission Form')]"))
        )
        
        self.assertTrue(form_title, "Event Form unaccessible")
        time.sleep(3)

def run():
    print("\nEvents Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()