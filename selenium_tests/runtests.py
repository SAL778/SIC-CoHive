# from smoketest import run as smokeTest
# from routingtests import run as routingTest
# from bookingstests import run as bookingsTest
# from eventstests import run as eventsTest
# from communitytests import run as communityTest
# from profiletests import run as profileTest
# from contacttests import run as contactTest
# from signouttests import run as signoutTest

# from config import PATH_TO_CHROMEDRIVER

# def runAll():
#     # smokeTest() # Makes sure that selenium is correctly configured
#     routingTest() # Works
#     # bookingsTest() # Works
#     # eventsTest() # Works
#     # communityTest() # Works
#     # profileTest() # Works
#     # contactTest() # Works
#     # signoutTest() # Works

# if __name__ == "__main__":
#     runAll()


from config import global_setup, global_teardown
global_setup()
from routingtests import run as run_routing_tests
from bookingstests import run as run_bookings_tests
from eventstests import run as run_events_tests
from communitytests import run as run_community_tests
from profiletests import run as run_profile_tests
# Import your test modules here

def runAll():
    # run_routing_tests()
    # run_bookings_tests()
    # run_events_tests()
    run_community_tests()
    # run_profile_tests()
    # Your test execution logic here
    # Example:
    # test_suite = unittest.TestSuite()
    # test_suite.addTest(unittest.makeSuite(TestRouting))
    # runner = unittest.TextTestRunner()
    # runner.run(test_suite)

    global_teardown()  # Clean up after tests

if __name__ == "__main__":
    runAll()