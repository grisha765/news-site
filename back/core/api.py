from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from db.db import init, close
from db.auth import create_user_if_not_exists, authenticate_user, hash_password
from core.modules import LoginRequest, LoginResponse

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


if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")
