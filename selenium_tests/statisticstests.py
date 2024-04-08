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

"""
Tests inputs and renders related to the statistics page
"""

host = "http://localhost:5173"

class TestRouting(unittest.TestCase) :
    def setUp(self):
        self.global_driver = global_driver

    def test_a_bar_graph(self):
        """US 4.01 4.02 - Verifies that in the All Time section, the bars in the bar graph appear when accessed from the webpage."""
        global_driver.get(f"{host}/statistics")
        time.sleep(2)
        all_time = global_driver.find_element(By.XPATH, "//button[text()='all time']")
        all_time.click()
        time.sleep(2)
        bar_element = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//*[local-name()='path'][@fill='rgba(234,88,12,0.85)']"))
        )
        self.assertTrue(bar_element, "Bar graph not showing up")

    def test_b_pie_graph(self):
        """US 4.01 4.02 - Verifies that in the All Time section, the pie graph appear when accessed from the webpage."""
        global_driver.get(f"{host}/statistics")
        time.sleep(2)
        all_time = global_driver.find_element(By.XPATH, "//button[text()='all time']")
        all_time.click()
        time.sleep(2)
        pie_element = WebDriverWait(global_driver, 3).until(
            EC.presence_of_element_located((By.XPATH, "//*[local-name()='path'][@fill='rgba(254,176,25,1)']"))
        )
        self.assertTrue(pie_element, "Bar graph not showing up")

    def test_c_student_element(self):
        """US 4.01 4.02 - Verifies that the Students Innovating Element stats show up."""
        global_driver.get(f"{host}/statistics")
        time.sleep(2)
        global_driver.execute_script("window.scrollBy(0, 750);") 
        time.sleep(2)
        students_innovating_element = global_driver.find_element(By.XPATH, "//h2[contains(text(), 'Students Innovating')]")
        time.sleep(2)
        self.assertTrue(students_innovating_element, "Students Innovating Element stats not showing up")

    def test_d_total_bookings(self):
        """US 4.01 4.02 - Verifies that the Students Innovating Element stats show up."""
        global_driver.get(f"{host}/statistics")
        time.sleep(2)
        global_driver.execute_script("window.scrollBy(0, 750);") 
        time.sleep(2)
        students_innovating_element = global_driver.find_element(By.XPATH, "//h2[contains(text(), 'Total Bookings')]")
        time.sleep(2)
        self.assertTrue(students_innovating_element, "Total Bookings stats not showing up")

    def test_e_average_booking(self):
        """US 4.01 4.02 - Verifies that the Students Innovating Element stats show up."""
        global_driver.get(f"{host}/statistics")
        time.sleep(2)
        global_driver.execute_script("window.scrollBy(0, 750);") 
        time.sleep(2)
        students_innovating_element = global_driver.find_element(By.XPATH, "//h2[contains(text(), 'Average Booking Time')]")
        time.sleep(2)
        self.assertTrue(students_innovating_element, "Average Booking Time stats not showing up")

    def test_f_download_svg(self):
        """US 4.02 - Verifies that you can download svg of a graph."""
        global_driver.get(f"{host}/statistics")
        time.sleep(2)
        all_time = global_driver.find_element(By.XPATH, "//button[text()='all time']")
        all_time.click()
        time.sleep(2)
        download_icon = global_driver.find_element(By.CSS_SELECTOR, ".fa.fa-download.text-orange-600.text-2xl")
        download_icon.click()
        time.sleep(2)
        download_svg = global_driver.find_element(By.XPATH, "//div[text()='Download SVG']")
        download_svg.click()
        time.sleep(2)
        self.assertTrue(download_svg, "Download SVG Unsuccessful")

    def test_g_download_png(self):
        """US 4.02 - Verifies that you can download png of a graph."""
        global_driver.get(f"{host}/statistics")
        time.sleep(2)
        all_time = global_driver.find_element(By.XPATH, "//button[text()='all time']")
        all_time.click()
        time.sleep(2)
        download_icon = global_driver.find_element(By.CSS_SELECTOR, ".fa.fa-download.text-orange-600.text-2xl")
        download_icon.click()
        time.sleep(2)
        download_svg = global_driver.find_element(By.XPATH, "//div[text()='Download PNG']")
        download_svg.click()
        time.sleep(2)
        self.assertTrue(download_svg, "Download PNG Unsuccessful")

    def test_h_download_csv(self):
        """US 4.02 - Verifies that you can download csv of a graph."""
        global_driver.get(f"{host}/statistics")
        time.sleep(2)
        all_time = global_driver.find_element(By.XPATH, "//button[text()='all time']")
        all_time.click()
        time.sleep(2)
        download_icon = global_driver.find_element(By.CSS_SELECTOR, ".fa.fa-download.text-orange-600.text-2xl")
        download_icon.click()
        time.sleep(2)
        download_svg = global_driver.find_element(By.XPATH, "//div[text()='Download CSV']")
        download_svg.click()
        time.sleep(2)
        self.assertTrue(download_svg, "Download CSV Unsuccessful")

def run():
    print("\nStatistics Tests:")
    test = unittest.TestLoader().loadTestsFromTestCase(TestRouting)
    runner = confTestRunner()
    runner.run(test)

if __name__ == "__main__":
    run()