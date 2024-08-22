from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    user: str
    role: str

class PostCreate(BaseModel):
    header: str
    body: str
    category: str

class CommentCreate(BaseModel):
    post_id: int
    user: str
    text: str

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

