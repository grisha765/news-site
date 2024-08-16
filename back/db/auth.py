import hashlib
from db.models import Auth
from tortoise.exceptions import DoesNotExist

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def create_user_if_not_exists(username: str, password: str, role: str = "user"):
    try:
        user = await Auth.get(user=username)
        return user
    except DoesNotExist:
        hashed_password = hash_password(password)
        user = await Auth.create(user=username, password=hashed_password, role=role)
        return user

async def authenticate_user(username: str, password: str):
    try:
        user = await Auth.get(user=username)
        if hash_password(password) == user.password:
            return user
        else:
            return None
    except DoesNotExist:
        return None


if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

