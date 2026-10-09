from fastapi import APIRouter
from ..schemas.nutrition import AskQuestionRequest, AskQuestionResponse
from ..services.chat_service import answer_food_question_service

router = APIRouter(prefix="/api", tags=["ask"])


@router.post("/ask", response_model=AskQuestionResponse)
async def ask_question_endpoint(req: AskQuestionRequest):
    """
    Evidence-grounded follow-up Q&A strictly bound to extracted food data with citations.
    """
    return answer_food_question_service(req.question, req.food_result)
