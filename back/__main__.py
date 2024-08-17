import os, sys, uvicorn, asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.config import Config
from config import logging_config
logging = logging_config.setup_logging(__name__)

def main():
    uvicorn.run("core.api:app", host=Config.api_ip, port=Config.api_port, reload=True)

if __name__ == '__main__':
    if Config.tests == "True":
        from autotests.run import run
        asyncio.run(run())
    else:
        main()
