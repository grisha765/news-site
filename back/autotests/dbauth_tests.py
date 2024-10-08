from db.models import Auth
from db.auth import create_user_if_not_exists, authenticate_user
from config import logging_config
logging = logging_config.setup_logging(__name__)

async def test_create_user():
    await Auth.filter(user="test_user").delete()
    
    user = await create_user_if_not_exists("test_user", "test_password", "admin")
    
    assert user.user == "test_user", "User creation failed"
    assert user.role == "admin", "Role assignment failed"
    
    assert user.password != "test_password", "Password hashing failed"
    
    user_in_db = await Auth.get_or_none(user="test_user")
    if user_in_db:
        logging.debug(f"User found in DB after creation: {user_in_db.user}, hashed password: {user_in_db.password}")
    else:
        logging.error("User not found in DB after creation.")
        raise AssertionError("User creation did not persist the user in the database.")

async def test_authenticate_user():
    user = await authenticate_user("test_user", "test_password")
    
    assert user is not None, "User authentication failed"
    assert user.user == "test_user", "Authenticated user does not match"
    
    user_wrong = await authenticate_user("test_user", "wrong_password")
    assert user_wrong is None, "Authentication should have failed with wrong password"

async def run_tests():

    try:
        await test_create_user()
        logging.info("Test test_create_user passed!")
        
        await test_authenticate_user()
        logging.info("Test test_authenticate_user passed!")
    except AssertionError as e:
        logging.error(f"Test failed: {e}")
        
if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

