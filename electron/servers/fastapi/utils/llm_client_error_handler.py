from fastapi import HTTPException
from anthropic import APIError as AnthropicAPIError
from openai import APIError as OpenAIAPIError
from google.genai.errors import APIError as GoogleAPIError
import traceback


def handle_llm_client_exceptions(e: Exception) -> HTTPException:
    traceback.print_exc()
    if isinstance(e, OpenAIAPIError):
        msg = str(e.message) if e.message else str(e)
        if "not a chat model" in msg.lower() or "v1/completions" in msg.lower():
            return HTTPException(
                status_code=400,
                detail="Выбранная модель не поддерживает Chat Completions. Используйте chat-модель: gpt-4.1, gpt-4o, gpt-4o-mini, gpt-3.5-turbo. Модели вроде gpt-3.5-turbo-instruct и text-davinci-* не поддерживаются.",
            )
        return HTTPException(status_code=500, detail=f"OpenAI API error: {msg}")
    if isinstance(e, GoogleAPIError):
        return HTTPException(status_code=500, detail=f"Google API error: {e.message}")
    if isinstance(e, AnthropicAPIError):
        return HTTPException(
            status_code=500, detail=f"Anthropic API error: {e.message}"
        )
    return HTTPException(status_code=500, detail=f"LLM API error: {e}")
