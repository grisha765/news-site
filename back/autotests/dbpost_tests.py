from db.models import PostModel, Category
from db.post import add_post, delete_post, get_post, get_all_posts
from config import logging_config
logging = logging_config.setup_logging(__name__)

async def test_add_post():
    await PostModel.filter(header="Test Header").delete()
    await Category.filter(name="Test Category").delete()

    post = await add_post("Test Header", "Test Body", "Test Category")
    
    logging.debug(f"Created post: {post.header}, Category: {post.category}")

    assert post.header == "Test Header", "Post header does not match"
    assert post.body == "Test Body", "Post body does not match"
    
    assert isinstance(post.category, Category), "Category is not a Category instance"
    
    assert post.category.name == "Test Category", "Post category does not match"

    post_in_db = await PostModel.get_or_none(id=post.id).select_related('category')
    assert post_in_db is not None, "Post was not saved in the database"
    
    if post_in_db:
        logging.debug(f"Post found in DB after creation: {post_in_db.header}, category: {post_in_db.category.name}")

async def test_delete_post():
    post = await add_post("Delete Header", "Delete Body", "Delete Category")

    result = await delete_post(post.id)
    
    assert result, "Post deletion failed"

    post_in_db = await PostModel.get_or_none(id=post.id)
    assert post_in_db is None, "Post was not deleted from the database"

async def test_get_post():
    post = await add_post("Get Header", "Get Body", "Get Category")

    fetched_post = await get_post(post.id)
    
    assert fetched_post is not None, "Failed to fetch post"
    assert fetched_post["header"] == "Get Header", "Fetched post header does not match"
    assert fetched_post["body"] == "Get Body", "Fetched post body does not match"
    assert fetched_post["category"] == "Get Category", "Fetched post category does not match"

    non_existent_post = await get_post(-1)
    
    assert non_existent_post is None, "Fetching non-existent post should return None"

async def test_get_all_posts():
    await PostModel.all().delete()

    await add_post("Header 1", "Body 1", "Category 1")
    await add_post("Header 2", "Body 2", "Category 2")

    all_posts = await get_all_posts()
    
    assert len(all_posts) == 2, "Not all posts were fetched"
    headers = [post["header"] for post in all_posts]
    assert "Header 1" in headers, "Post 'Header 1' was not found in fetched posts"
    assert "Header 2" in headers, "Post 'Header 2' was not found in fetched posts"

async def run_tests():
    try:
        await test_add_post()
        logging.info("Test test_add_post passed!")
        
        await test_delete_post()
        logging.info("Test test_delete_post passed!")
        
        await test_get_post()
        logging.info("Test test_get_post passed!")
        
        await test_get_all_posts()
        logging.info("Test test_get_all_posts passed!")
    except AssertionError as e:
        logging.error(f"Test failed: {e}")

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

