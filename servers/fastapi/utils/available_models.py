from openai import AsyncOpenAI
from fastapi import HTTPException

# Completion-only models (v1/completions) — не поддерживают Chat Completions API
_COMPLETION_ONLY_MODELS = frozenset({
    "gpt-3.5-turbo-instruct",
    "davinci-002",
    "babbage-002",
    "text-davinci-003",
    "text-davinci-002",
    "text-davinci-001",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001",
    "davinci",
    "curie",
    "babbage",
    "ada",
})


def _is_chat_model(model_id: str) -> bool:
    """Проверяет, что модель поддерживает Chat Completions."""
    if model_id in _COMPLETION_ONLY_MODELS:
        return False
    if model_id.startswith("text-") or model_id.startswith("davinci-") or model_id.startswith("babbage-"):
        return False
    return True


async def list_available_openai_compatible_models(url: str, api_key: str) -> list[str]:
    client = AsyncOpenAI(api_key=api_key, base_url=url)
    models = (await client.models.list()).data
    if models:
        all_ids = [m.id for m in models]
        # Фильтруем только chat-модели (приложение использует Chat Completions API)
        return [mid for mid in all_ids if _is_chat_model(mid)] or all_ids
    return []


async def list_available_anthropic_models(api_key: str) -> list[str]:
    try:
        from anthropic import AsyncAnthropic
    except ImportError as e:
        raise HTTPException(
            status_code=400,
            detail="Anthropic provider selected but 'anthropic' package is not installed",
        ) from e

    client = AsyncAnthropic(api_key=api_key)
    return list(map(lambda x: x.id, (await client.models.list(limit=50)).data))


async def list_available_google_models(api_key: str) -> list[str]:
    try:
        from google import genai
    except ImportError as e:
        raise HTTPException(
            status_code=400,
            detail="Google provider selected but 'google-genai' package is not installed",
        ) from e

    client = genai.Client(api_key=api_key)
    return list(map(lambda x: x.name, client.models.list(config={"page_size": 50})))
