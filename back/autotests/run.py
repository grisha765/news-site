import os
from config import logging_config
import logging as logging_base
from db.db import init, close
from autotests.dbauth_tests import run_tests as dbauth_tests
from autotests.dbfile_tests import run_tests as dbfile_tests

async def run():
    logging = logging_config.setup_logging(__name__)

    error_count = 0
    warning_count = 0
    passed_count = 0

    class TestLoggingHandler(logging_base.Handler):
        def emit(self, record):
            nonlocal error_count, warning_count, passed_count
            log_message = self.format(record)
            if 'passed!' in log_message:
                passed_count += 1
            elif record.levelname == 'ERROR' or 'An error occurred' in log_message:
                error_count += 1
            elif record.levelname == 'WARNING':
                warning_count += 1

    test_logging_handler = TestLoggingHandler()
    logging_base.getLogger().addHandler(test_logging_handler)

    try:
        await init()
        logging.info(f'Start tests...')
        await dbauth_tests()
        await dbfile_tests()
    except Exception as e:
        logging.error(f"An error occurred during test execution: {e}")
    finally:
        logging.info(f'All tests completed! [Errors: {error_count}, Warnings: {warning_count}, Passed: {passed_count}]')
        await close()
        if error_count > 0:
            os._exit(1)
        else:
            os._exit(0)

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")
