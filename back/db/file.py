from io import BytesIO
from db.models import FileModel
from config import logging_config
logging = logging_config.setup_logging(__name__)

async def upload_file(file):
    logging.debug(f"Starting file upload: {file.filename}")

    file_content = await file.read()
    logging.debug(f"File read, size: {len(file_content)} bytes")

    db_file = await FileModel.create(
        filename=file.filename,
        file_content=file_content,
    )

    logging.debug(f"File saved to database with ID: {db_file.id}")
    return {"file_id": db_file.id, "filename": db_file.filename}

async def get_file(file_id: int):
    logging.debug(f"Requesting file with ID: {file_id}")

    db_file = await FileModel.get(id=file_id)

    if not db_file:
        logging.warning(f"File with ID: %d not found {file_id}")
        return False

    logging.debug(f"File with ID: {file_id} found, size: {len(db_file.file_content)} bytes")

    file_like = BytesIO(db_file.file_content)
    return file_like

async def del_file(file_id: int):
    logging.debug(f"Attempting to delete file with ID: {file_id}")

    db_file = await FileModel.get(id=file_id)

    if not db_file:
        logging.warning(f"File with ID: {file_id} not found")
        return {"status": "error", "message": "File not found"}

    await db_file.delete()

    logging.debug(f"File with ID: {file_id} successfully deleted")
    return {"status": "success", "message": f"File with ID {file_id} deleted"}

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

