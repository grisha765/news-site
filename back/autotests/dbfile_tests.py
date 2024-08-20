from io import BytesIO
from db.models import FileModel
from db.file import upload_file, get_file, del_file
from config import logging_config
logging = logging_config.setup_logging(__name__)

class MockFile:
    def __init__(self, content, filename):
        self.file = BytesIO(content)
        self.filename = filename

    async def read(self):
        return self.file.read()

async def test_upload_file():
    await FileModel.filter(filename="test_file.txt").delete()

    mock_file = BytesIO(b"Test content")
    mock_file = MockFile(b"Test content", "test_file.txt")

    result = await upload_file(mock_file)

    assert result["filename"] == "test_file.txt", "Filename mismatch"
    
    db_file = await FileModel.get_or_none(id=result["file_id"])
    assert db_file is not None, "File was not saved in the database"
    assert db_file.filename == "test_file.txt", "Filename in DB mismatch"
    assert db_file.file_content == b"Test content", "File content mismatch"

async def test_get_file():
    db_file = await FileModel.get_or_none(filename="test_file.txt")
    assert db_file is not None, "File should exist in the database"

    file_like = await get_file(db_file.id)
    
    assert file_like is not False, "File retrieval failed"
    assert isinstance(file_like, BytesIO), "Retrieved file is not a BytesIO object"
    assert file_like.read() == b"Test content", "Retrieved file content mismatch"

    incorrect_id = db_file.id + 999
    try:
        result = await get_file(incorrect_id)
        assert result is False, "Function should have raised an exception for non-existing file ID"
    except Exception as e:
        assert "does not exist" in str(e), f"Unexpected error message: {e}"
        logging.warning("Test for non-existing file ID passed with expected exception!")

async def test_delete_file():
    db_file = await FileModel.get_or_none(filename="test_file.txt")
    assert db_file is not None, "File should exist in the database before deletion"

    delete_result = await del_file(db_file.id)
    assert delete_result["status"] == "success", "File deletion failed"

    db_file_after_delete = await FileModel.get_or_none(id=db_file.id)
    assert db_file_after_delete is None, "File was not deleted from the database"

    try:
        delete_result_again = await del_file(db_file.id + 999)
        assert delete_result_again["status"] == "error", "File deletion should have failed for non-existing file"
        assert delete_result_again["message"] == "File not found", "Error message mismatch for non-existing file"
    except Exception as e:
        assert "does not exist" in str(e), f"Unexpected error message: {e}"
        logging.warning("Test for non-existing file ID passed with expected exception!")

async def run_tests():
    try:
        await test_upload_file()
        logging.info("Test test_upload_file passed!")
        
        await test_get_file()
        logging.info("Test test_get_file passed!")

        await test_delete_file()
        logging.info("Test test_delete_file passed!")
    except AssertionError as e:
        logging.error(f"Test failed: {e}")
        
if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

