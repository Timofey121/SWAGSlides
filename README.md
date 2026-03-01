# SWAGSlides

**SWAGSlides** — open-source AI-генератор презентаций. Работает локально, поддерживает OpenAI, Google Gemini, Anthropic Claude, Ollama и совместимые API.

**Возможности:**
- Генерация презентаций по промпту или загруженным документам
- Шаблоны из существующих PPTX-файлов
- Экспорт в PowerPoint (PPTX) и PDF
- Поддержка кастомных HTML-шаблонов и Tailwind CSS
- MCP-сервер для интеграции с AI-инструментами

## Быстрый старт

### Docker (рекомендуется)

1. Создайте файл `.env` в корне проекта с вашими API-ключами:

```bash
# Пример для OpenAI
LLM=openai
OPENAI_API_KEY=sk-...
IMAGE_PROVIDER=dall-e-3

# Или для Ollama (локально)
# LLM=ollama
# OLLAMA_MODEL=llama3.2:3b
# IMAGE_PROVIDER=pexels
# PEXELS_API_KEY=...
```

2. Сборка и запуск:

```bash
# Сборка образа (без кэша)
docker build --no-cache -t swagslides:local -f Dockerfile .

# Сборка и запуск одной командой
cd /path/to/SWAGSlides \
&& mkdir -p app_data \
&& docker build --no-cache -t swagslides:local -f Dockerfile . \
&& docker run --rm -it --name swagslides \
  -p 5000:80 \
  --env-file .env \
  -v "$PWD/app_data:/app_data" \
  swagslides:local
```

Откройте http://localhost:5000

### Локальный запуск (без Docker)

**Требования:** Node.js 20+, Python 3.11+, uv (или pip)

1. Установка зависимостей:

```bash
# FastAPI
cd servers/fastapi && uv sync  # или: pip install -e .

# Next.js
cd servers/nextjs && npm install
```

2. Создайте `.env` и настройте переменные (см. раздел «Конфигурация»).

3. Запуск:

```bash
# Вариант A: через start.js (нужен nginx)
node start.js
# Откройте http://localhost:5000

# Вариант B: вручную в двух терминалах
# Терминал 1 — FastAPI
cd servers/fastapi && uv run python server.py --port 8000 --reload false

# Терминал 2 — Next.js
cd servers/nextjs && NEXT_PUBLIC_FAST_API=http://localhost:8000 npm run dev
# Откройте http://localhost:3000
```

## Конфигурация

Основные переменные окружения:

| Переменная | Описание |
|------------|----------|
| `LLM` | Провайдер: `openai`, `google`, `anthropic`, `ollama`, `custom` |
| `OPENAI_API_KEY` | Ключ OpenAI (если LLM=openai) |
| `OPENAI_MODEL` | Модель OpenAI (по умолчанию: gpt-4.1) |
| `GOOGLE_API_KEY` | Ключ Google (если LLM=google) |
| `ANTHROPIC_API_KEY` | Ключ Anthropic (если LLM=anthropic) |
| `OLLAMA_MODEL` | Модель Ollama (если LLM=ollama) |
| `IMAGE_PROVIDER` | Провайдер изображений: `dall-e-3`, `gpt-image-1.5`, `gemini_flash`, `pexels`, `pixabay` |
| `CAN_CHANGE_KEYS` | `true` — разрешить менять ключи в UI, `false` — только через env |

Полный список переменных см. в `docker-compose.yml` и комментариях в `start.js`.

## API

### Генерация презентации

```bash
curl -X POST http://localhost:5000/api/v1/ppt/presentation/generate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Введение в машинное обучение",
    "n_slides": 5,
    "language": "Russian",
    "export_as": "pptx"
  }'
```

Ответ содержит `presentation_id`, `path` и `edit_path`.

## Структура проекта

```
SWAGSlides/
├── servers/
│   ├── fastapi/     # Backend API
│   └── nextjs/      # Frontend
├── start.js         # Запуск серверов
├── docker-compose.yml
└── Dockerfile
```