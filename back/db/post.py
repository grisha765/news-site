from tortoise.exceptions import DoesNotExist
from db.models import PostModel, Category
from config import logging_config
logging = logging_config.setup_logging(__name__)

async def add_post(header: str, body: str, category_name: str):
    logging.debug(f"Adding post with header: {header}, body: {len(body)} characters, category: {category_name}")
    category, created = await Category.get_or_create(name=category_name)

    if created:
        logging.debug(f"Category '{category_name}' was created")
    else:
        logging.debug(f"Category '{category_name}' already exists")

    text = await PostModel.create(header=header, body=body, category=category)

    logging.debug(f"Post created with ID: {text.id}")
    return text

async def delete_post(text_id: int):
    logging.debug(f"Attempting to delete post with ID: {text_id}")
    try:
        text = await PostModel.get(id=text_id)
        await text.delete()
        logging.debug(f"Post with ID: {text_id} successfully deleted")
        return True
    except DoesNotExist:
        logging.warning(f"Post with ID: {text_id} does not exist")
        return False

async def get_post(text_id: int):
    logging.debug(f"Fetching post with ID: {text_id}")
    try:
        text = await PostModel.get(id=text_id).select_related('category')
        logging.debug(f"Post with ID: {text_id} found")
        return {
            "id": text.id,
            "header": text.header,
            "body": text.body,
            "category": text.category.name
        }
    except DoesNotExist:
        logging.warning(f"Post with ID: {text_id} does not exist")
        return None

async def get_all_posts():
    logging.debug("Fetching all posts")
    texts = await PostModel.all().select_related('category')
    logging.debug(f"Total posts fetched: {len(texts)}")
    return [
        {
            "id": text.id,
            "header": text.header,
            "body": text.body,
            "category": text.category.name
        }
        for text in texts
    ]

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")
