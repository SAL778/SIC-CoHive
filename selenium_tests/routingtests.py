import unittest, time
from config import confTestRunner, global_driver
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

"""
Tests intra-site navigation and routing, particularly with the sidebar.
"""

host = "http://localhost:5173"


class TestRouting(unittest.TestCase):
    def setUp(self):
        self.global_driver = global_driver

    def test_a_bookings_tab_sidebar(self):
        """Verifies that the bookings page can be navigated to succesfully using the sidebar"""
        # global_driver.get("http://localhost:5173/bookings")
        global_driver.get(f"{host}/bookings")
        time.sleep(3)
        community_tab = global_driver.find_element(By.XPATH, "//p[@class='block' and text()='Bookings']")
        community_tab.click()
        time.sleep(3)
        self.assertEqual(global_driver.current_url, f"{host}/bookings")

    def test_b_events_tab_sidebar(self):
        """Verifies that the events page can be navigated to succesfully using the sidebar"""
        global_driver.get(f"{host}/bookings")
        time.sleep(3)
        community_tab = global_driver.find_element(By.XPATH, "//p[@class='block' and text()='Events']")
        community_tab.click()
        time.sleep(3)
        self.assertEqual(global_driver.current_url, f"{host}/events")

    def test_c_community_tab_sidebar(self):
        """Verifies that the community page can be navigated to succesfully using the sidebar"""
        global_driver.get(f"{host}/bookings")
        time.sleep(3)
        community_tab = global_driver.find_element(By.XPATH, "//p[@class='block' and text()='Community']")
        community_tab.click()
        time.sleep(3)
        self.assertEqual(global_driver.current_url, f"{host}/community")

    def test_c_statistics_tab_sidebar(self):
        """Verifies that the statistics page can be navigated to succesfully using the sidebar"""
        global_driver.get(f"{host}/bookings")
        time.sleep(3)
        community_tab = global_driver.find_element(By.XPATH, "//p[@class='block' and text()='Statistics']")
        community_tab.click()
        time.sleep(3)
        self.assertEqual(global_driver.current_url, f"{host}/statistics")

    def test_d_profile_tab_sidebar(self):
        """Verifies that the profile page can be navigated to succesfully using the sidebar"""
        global_driver.get(f"{host}/bookings")
        time.sleep(3)
        community_tab = global_driver.find_element(By.XPATH, "//p[@class='block' and text()='Profile']")
        community_tab.click()
        time.sleep(3)
        self.assertEqual(global_driver.current_url, f"{host}/profile")

    def test_e_contact_tab_sidebar(self):
        """Verifies that the feedback page can be navigated to succesfully using the sidebar"""
        global_driver.get(f"{host}/bookings")
        time.sleep(3)
        community_tab = global_driver.find_element(By.XPATH, "//p[@class='block' and text()='Contact']")
        community_tab.click()
        time.sleep(3)
        self.assertEqual(global_driver.current_url, f"{host}/feedback")

def run():
    print("\nNavbar Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    unittest.main()