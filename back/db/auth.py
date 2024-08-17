import hashlib
from db.models import Auth
from tortoise.exceptions import DoesNotExist
from config import logging_config
logging = logging_config.setup_logging(__name__)

def hash_password(password: str) -> str:
    hash = hashlib.sha256(password.encode()).hexdigest()
    logging.debug(f"Password hash: {hash}")
    return hash

async def create_user_if_not_exists(username: str, password: str, role: str = "user"):
    try:
        user = await Auth.get(user=username)
        return user
    except DoesNotExist:
        hashed_password = hash_password(password)
        user = await Auth.create(user=username, password=hashed_password, role=role)
        logging.debug(f"User created with hashed password: {user.password}")
        return user

async def authenticate_user(username: str, password: str):
    try:
        user = await Auth.get(user=username)
        if hash_password(password) == user.password:
            logging.debug(f"Authenticated User: {user.user}, Role: {user.role}, Password (hashed): {user.password}")
            return user
        else:
            logging.warning("Authentication failed: User not found or wrong password.")
            return None
    except DoesNotExist:
        logging.warning("Authentication failed: User not found or wrong password.")
        return None


if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

