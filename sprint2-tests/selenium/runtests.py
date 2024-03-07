from smoketest import run as smokeTestRun
from routingtests import run as routingTestRun
from feedbacktests import run as feedbackTestRun
from communitytests import run as communityTestRun

from config import PATH_TO_CHROMEDRIVER

def runAll():
    #smokeTestRun() #Makes sure that selenium is correctly configured
    routingTestRun()
    feedbackTestRun()
    communityTestRun()

if __name__ == "__main__":
    runAll()