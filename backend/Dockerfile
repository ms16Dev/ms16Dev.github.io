FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code from backend
COPY . .

# Expose port (Fly sets $PORT dynamically)
ENV PORT 8080

# Run FastAPI via uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
