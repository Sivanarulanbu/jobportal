# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY job-portal-frontend/package*.json ./
RUN npm ci
COPY job-portal-frontend/ ./
RUN npm run build

# Stage 2: Django backend with Nginx
FROM python:3.12-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    postgresql-client \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip setuptools wheel

# Setup Python environment
COPY job_portal_backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django backend
COPY job_portal_backend/ ./backend/

# Copy built React frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist ./backend/staticfiles/

# Copy Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
cd /app/backend\n\
echo "Running migrations..."\n\
python manage.py migrate --noinput\n\
echo "Collecting static files..."\n\
python manage.py collectstatic --noinput\n\
echo "Starting Gunicorn..."\n\
gunicorn job_portal_backend.wsgi:application --bind 0.0.0.0:8000 --workers 4 &\n\
echo "Starting Nginx..."\n\
nginx -g "daemon off;"' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 80 8000
CMD ["/app/start.sh"]
