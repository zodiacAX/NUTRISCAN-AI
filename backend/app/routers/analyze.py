from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from ..schemas.nutrition import FoodScanResult
from ..services.image_validator import validate_image_bytes, ImageValidationError
from ..services.gemma_service import gemma_service

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze", response_model=FoodScanResult)
async def analyze_food_endpoint(
    image: UploadFile = File(..., description="Food or packaging photograph"),
    food_type: str = Form("packaged", description="'packaged' or 'cooked_meal'"),
    user_context: Optional[str] = Form("", description="Optional user context notes or serving context"),
    product_name: Optional[str] = Form(None, description="Optional manual product name")
):
    """
    Accepts multipart food photo upload, verifies magic bytes signature, executes Gemma 4
    multimodal analysis, cross-references Open Food Facts, and returns structured nutrition intelligence.
    """
    content = await image.read()
    
    # 1. Validate image bytes and signature
    format_name, (width, height) = validate_image_bytes(content, filename=image.filename or "")

    # 2. Execute Gemma 4 multimodal inference
    try:
        mime = image.content_type or f"image/{format_name.lower()}"
        result = await gemma_service.analyze_food_image(
            image_bytes=content,
            mime_type=mime,
            filename=image.filename or "uploaded.jpg",
            food_type=food_type,
            user_context=user_context or ""
        )
        if product_name and product_name.strip():
            result.name = product_name.strip()

        return result
    except TimeoutError as err:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Model inference timed out: {str(err)}"
        )
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Model returned invalid or malformed output: {str(err)}"
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis pipeline error: {str(err)}"
        )
