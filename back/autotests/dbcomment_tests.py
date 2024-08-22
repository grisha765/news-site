from db.models import CommentModel
from db.comment import send_comment, del_comment, get_comments
from db.post import add_post
from config import logging_config
logging = logging_config.setup_logging(__name__)

async def test_send_comment():
    post = await add_post("Comment Test Header", "Comment Test Body", "Comment Test Category")
    
    await CommentModel.filter(post=post).delete()

    comment = await send_comment(post.id, "testuser", "Test Comment")
    
    logging.debug(f"Created comment: {comment.text}, User: {comment.username}")

    assert comment.text == "Test Comment", "Comment text does not match"
    assert comment.username == "testuser", "Comment username does not match"
    assert comment.post.id == post.id, "Comment post ID does not match"

    comment_in_db = await CommentModel.get_or_none(id=comment.id)
    assert comment_in_db is not None, "Comment was not saved in the database"
    
    if comment_in_db:
        logging.debug(f"Comment found in DB after creation: {comment_in_db.text}, user: {comment_in_db.username}")

async def test_del_comment():
    post = await add_post("Delete Comment Header", "Delete Comment Body", "Delete Comment Category")
    comment = await send_comment(post.id, "deleteuser", "Delete Comment")

    result = await del_comment(post.id, comment.id)
    
    assert result, "Comment deletion failed"

    comment_in_db = await CommentModel.get_or_none(id=comment.id)
    assert comment_in_db is None, "Comment was not deleted from the database"

async def test_get_comments():
    post = await add_post("Get Comments Header", "Get Comments Body", "Get Comments Category")
    
    await CommentModel.filter(post=post).delete()

    await send_comment(post.id, "user1", "Comment 1")
    await send_comment(post.id, "user2", "Comment 2")

    comments = await get_comments(post.id)
    
    assert len(comments) == 2, "Not all comments were fetched"
    texts = [comment["text"] for comment in comments]
    assert "Comment 1" in texts, "Comment 'Comment 1' was not found in fetched comments"
    assert "Comment 2" in texts, "Comment 'Comment 2' was not found in fetched comments"

    non_existent_comments = await get_comments(-1)
    
    assert non_existent_comments is None, "Fetching comments for non-existent post should return None"

async def run_tests():
    try:
        await test_send_comment()
        logging.info("Test test_send_comment passed!")
        
        await test_del_comment()
        logging.info("Test test_del_comment passed!")
        
        await test_get_comments()
        logging.info("Test test_get_comments passed!")
    except AssertionError as e:
        logging.error(f"Test failed: {e}")

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

