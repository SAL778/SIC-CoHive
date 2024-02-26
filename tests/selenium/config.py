import unittest

##Change this
PATH_TO_CHROMEDRIVER = "/usr/local/bin/chromedriver" #Change this to wherever your local is
SLEEP_TIME = 1                                       #Time between selenium test calls

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