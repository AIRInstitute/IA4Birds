import pytest

BASE_URL = "http://localhost:5000/ai4birds-coordinate-service/v1/coordinate"
AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaW50ZW50IjoiYWNjZXNzIiwiaWF0IjoxNzQzNTAzMjc1LCJleHAiOjE3NDM1MDY4NzV9.-zb34n0QhxWl2Yw1wmDVxY6uy6sxAV3GkEOoRX_fDb4"  
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaW50ZW50IjoiYWNjZXNzIiwiaWF0IjoxNzQzNTAzMjc1LCJleHAiOjE3NDM1MDY4NzV9.-zb34n0QhxWl2Yw1wmDVxY6uy6sxAV3GkEOoRX_fDb4"  

@pytest.fixture
def headers():
    return {
        "Authorization": AUTH_TOKEN,
        "Content-Type": "application/json"
    }
