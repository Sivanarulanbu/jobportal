# ===========================
# Stage 1: Build React frontend
# ===========================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies
COPY job-portal-frontend/package*.json ./
RUN npm ci

# Build the app
COPY job-portal-frontend/ ./
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build


# ===========================
# Stage 2: Backend + Gunicorn + Nginx
# ===========================
FROM python:3.11-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    postgresql-client \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create nginx user if it doesn't exist (fixing getpwnam error)
RUN groupadd -r nginx && useradd -r -g nginx nginx

# Upgrade pip
RUN pip install --upgrade pip setuptools wheel

# Install Python dependencies
COPY job_portal_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY job_portal_backend/ ./backend/

# Copy built React files to Django static folder
# Copy built React files to Django build folder for collection
COPY --from=frontend-builder /app/frontend/dist ./backend/build/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create startup script
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
set -e
cd /app/backend

echo "Running migrations..."
python manage.py migrate --noinput || true

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

echo "Starting Gunicorn..."
# Start Gunicorn in background
gunicorn job_portal_backend.wsgi:application --bind 127.0.0.1:8000 --workers 4 --timeout 120 --access-logfile - &
GUNICORN_PID=$!

echo "Starting Nginx..."
# Start Nginx in background
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
EOF
RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/app/start.sh"]
