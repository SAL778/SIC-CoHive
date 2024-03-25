import unittest

##Change this
PATH_TO_CHROMEDRIVER = "/usr/local/bin/chromedriver" #Change this to wherever your local is
SLEEP_TIME = 2                                       #Default time between selenium test calls, some events overwrite this.
HOSTNAME = "127.0.0.1"
PORT = "5173"

ADDRESS = "http://" + HOSTNAME + ":" + PORT

#What it says on success
#test.shortDescription() is whatever you place in the docstrings of the defined function
class confTestResult(unittest.TextTestResult):
    def addSuccess(self, test):
        super().addSuccess(test)
        self.stream.writeln("Success - {}".format(test.shortDescription())) 

    def addError(self, test, err):
        super().addError(test, err)
        self.stream.writeln("Error - {}".format(test.shortDescription())) #Change this to possibly run error message

#This runs prints our custom test messages
class confTestRunner(unittest.TextTestRunner):
    resultclass = confTestResult
