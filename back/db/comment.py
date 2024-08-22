from tortoise.exceptions import DoesNotExist
from db.models import CommentModel, PostModel
from config import logging_config
logging = logging_config.setup_logging(__name__)

async def send_comment(post_id: int, username: str, text: str):
    logging.debug(f"Sending comment to post ID: {post_id} by user: {username}")
    try:
        post = await PostModel.get(id=post_id)
        comment = await CommentModel.create(post=post, username=username, text=text)
        logging.debug(f"Comment created with ID: {comment.id} for post ID: {post_id}")
        return comment
    except DoesNotExist:
        logging.warning(f"Post with ID: {post_id} does not exist")
        return None

async def del_comment(post_id: int, comment_id: int):
    logging.debug(f"Attempting to delete comment ID: {comment_id} from post ID: {post_id}")
    try:
        comment = await CommentModel.get(id=comment_id, post_id=post_id)
        await comment.delete()
        logging.debug(f"Comment with ID: {comment_id} successfully deleted")
        return True
    except DoesNotExist:
        logging.warning(f"Comment with ID: {comment_id} does not exist or does not belong to post ID: {post_id}")
        return False

async def get_comments(post_id: int):
    logging.debug(f"Fetching comments for post ID: {post_id}")
    try:
        post = await PostModel.get(id=post_id)
        comments = await CommentModel.filter(post=post).all()
        logging.debug(f"Found {len(comments)} comments for post ID: {post_id}")
        return [
            {
                "id": comment.id,
                "username": comment.username,
                "text": comment.text,
                "created_at": comment.created_at
            }
            for comment in comments
        ]
    except DoesNotExist:
        logging.warning(f"Post with ID: {post_id} does not exist")
        return None

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

