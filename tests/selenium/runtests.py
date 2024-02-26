from smoketest import run as smokeTestRun
from routingtests import run as routingTestRun
from config import PATH_TO_CHROMEDRIVER

def runAll():
    #smokeTestRun() #Makes sure that selenium is correctly configured
    routingTestRun()

if __name__ == "__main__":
    runAll()