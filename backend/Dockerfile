FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# System deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      pkg-config \
      libssl-dev \
      libffi-dev \
      default-libmysqlclient-dev \
      netcat-traditional \
      procps \
      curl \ 
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r app && useradd -r -g app -m -d /home/app app

# --- CREATE STATIC AND MEDIA FOLDERS ---
RUN mkdir -p /backend/static /backend/media

WORKDIR /backend

# Copy and install Python deps
COPY requirements.txt /backend/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r /backend/requirements.txt

# Copy project
COPY . /backend

# Make entrypoint executable and fix CRLF
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# Make app directory owned by non-root user
RUN chown -R app:app /backend /entrypoint.sh

USER app

ENTRYPOINT ["/entrypoint.sh"]
