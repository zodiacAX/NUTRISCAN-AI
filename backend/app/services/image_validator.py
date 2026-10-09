import io
from typing import Tuple
from PIL import Image, UnidentifiedImageError
from fastapi import HTTPException, status
from ..config import settings


class ImageValidationError(HTTPException):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


def validate_image_bytes(content: bytes, filename: str = "") -> Tuple[str, Tuple[int, int]]:
    """
    Validates uploaded image by size, magic bytes signature, and Pillow integrity verification.
    Returns detected format (e.g. 'JPEG', 'PNG', 'WEBP') and dimensions (width, height).
    """
    if not content or len(content) == 0:
        raise ImageValidationError("Uploaded image file is empty.", status_code=status.HTTP_400_BAD_REQUEST)

    # 1. Enforce file size limit
    if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
        size_mb = len(content) / (1024 * 1024)
        raise ImageValidationError(
            f"Image size ({size_mb:.1f} MB) exceeds maximum allowed limit of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)} MB.",
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
        )

    # 2. Check Magic Bytes File Signature
    is_jpeg = content.startswith(b'\xff\xd8\xff')
    is_png = content.startswith(b'\x89PNG\r\n\x1a\n')
    is_webp = content.startswith(b'RIFF') and len(content) >= 12 and content[8:12] == b'WEBP'

    if not (is_jpeg or is_png or is_webp):
        raise ImageValidationError(
            "Invalid file signature. File does not match supported image formats (JPG, JPEG, PNG, WEBP).",
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
        )

    # 3. Pillow Image verification for structural integrity
    try:
        with Image.open(io.BytesIO(content)) as img:
            img.verify()
            format_name = img.format or ("JPEG" if is_jpeg else "PNG" if is_png else "WEBP")
            size = img.size
    except (UnidentifiedImageError, OSError, Exception) as err:
        raise ImageValidationError(
            f"Corrupted or unreadable image file: {str(err)}",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    # 4. Check extension if filename provided
    if filename:
        lower_name = filename.lower()
        has_valid_ext = any(lower_name.endswith(ext) for ext in settings.ALLOWED_IMAGE_EXTENSIONS)
        if not has_valid_ext:
            raise ImageValidationError(
                f"Unsupported file extension in '{filename}'. Allowed extensions: {', '.join(settings.ALLOWED_IMAGE_EXTENSIONS)}",
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
            )

    return format_name, size
