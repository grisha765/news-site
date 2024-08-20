from fastapi import FastAPI, UploadFile, HTTPException, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from db.db import init, close
from db.auth import create_user_if_not_exists, authenticate_user, hash_password
from core.modules import LoginRequest, LoginResponse, PostCreate
from db.file import upload_file, get_file, del_file
from db.post import add_post, delete_post, get_post, get_all_posts

async def lifespan(app: FastAPI):
    await init()
    await create_user_if_not_exists(username="root", password="admin", role="admin")
    try:
        yield
    finally:
        await close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user = await authenticate_user(username=request.username, password=request.password)
    
    if user:
        return LoginResponse(user=user.user, role=user.role)
    
    existing_user = await create_user_if_not_exists(username=request.username, password=request.password)
    if existing_user and hash_password(request.password) != existing_user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")

    user = await create_user_if_not_exists(username=request.username, password=request.password)
    
    return LoginResponse(user=user.user, role=user.role)

@app.post("/uploadfile/")
async def upload_file_endpoint(file: UploadFile = File(...)):
    return await upload_file(file)

@app.get("/downloadfile/{file_id}")
async def get_file_endpoint(file_id: int):
    response = await get_file(file_id)
    if response == False:
        raise HTTPException(status_code=404, detail="File not found")
    return StreamingResponse(response, media_type="image/jpeg", headers={"Content-Disposition": f"inline; filename=image"})

@app.delete("/deletefile/{file_id}")
async def delete_file_endpoint(file_id: int):
    result = await del_file(file_id)
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@app.post("/texts/")
async def create_post(text: PostCreate):
    created_text = await add_post(text.header, text.body, text.category)
    return {
        "id": created_text.id,
        "header": created_text.header,
        "body": created_text.body,
        "category": created_text.category.name
    }

@app.delete("/texts/{text_id}")
async def remove_post(text_id: int):
    success = await delete_post(text_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"detail": "Text deleted successfully"}

@app.get("/texts/{text_id}")
async def read_post(text_id: int):
    text = await get_post(text_id)
    if not text:
        raise HTTPException(status_code=404, detail="Post not found")
    return text

@app.get("/texts/")
async def read_all_posts():
    texts = await get_all_posts()
    return texts

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")
