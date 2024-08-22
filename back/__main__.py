import os, sys, uvicorn, asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.config import Config
from config import logging_config
logging = logging_config.setup_logging(__name__)

def main():
    ssl_params = {}
    if "example.com" not in Config.api_https:
        parts = Config.api_https.split('/')
        logging.info(f"use https mode: https://{parts[4]}:{str(Config.api_port)}")
        ssl_params = {
            'ssl_keyfile': f'{Config.api_https}/privkey.pem',
            'ssl_certfile': f'{Config.api_https}/fullchain.pem'
        }

    uvicorn.run(
                "core.api:app",
                host=Config.api_ip,
                port=Config.api_port,
                reload=True,
                **ssl_params
                )

if __name__ == '__main__':
    if Config.tests == "True":
        from autotests.run import run
        asyncio.run(run())
    else:
        main()
