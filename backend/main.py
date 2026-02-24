from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from starlette.responses import FileResponse

from backend.routes import auth, admin

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you should restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.get("/api/health")
def read_root():
    return {"status": "ok"}

# Serve Frontend
app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

@app.get("/{catchall:path}")
async def serve_spa(catchall: str):
    return FileResponse("dist/index.html")
