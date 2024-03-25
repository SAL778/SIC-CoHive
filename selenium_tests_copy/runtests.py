from smoketest import run as smokeTest
from routingtests import run as routingTest
from bookingstests import run as bookingsTest
from eventstests import run as eventsTest
from communitytests import run as communityTest
from profiletests import run as profileTest
from contacttests import run as contactTest
from signouttests import run as signoutTest

from config import PATH_TO_CHROMEDRIVER

def runAll():
    # smokeTest() # Makes sure that selenium is correctly configured
    # routingTest() # Works
    bookingsTest() # Works
    # eventsTest() # Works
    # communityTest() # Works
    # profileTest() # Works
    # contactTest() # Works
    # signoutTest() # Works

if __name__ == "__main__":
    runAll()