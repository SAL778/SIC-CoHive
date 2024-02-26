from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from config import PATH_TO_CHROMEDRIVER

#This verifies that your selenium setup is correct. You should recieve "Recieved!" on success.

def run():
    # # Create ChromeOptions object
    # chrome_options = Options()

    service = Service(PATH_TO_CHROMEDRIVER)
    driver = webdriver.Chrome(service=service)

    driver.get("https://www.selenium.dev/selenium/web/web-form.html")

    title = driver.title

    driver.implicitly_wait(0.5)

    text_box = driver.find_element(By.NAME, "my-text")
    submit_button = driver.find_element(By.CSS_SELECTOR, "button")

    text_box.send_keys("Selenium")
    submit_button.click()

    message = driver.find_element(By.ID, "message")
    text = message.text

    print(text)

    driver.quit()

if __name__ == "__main__":
    run()