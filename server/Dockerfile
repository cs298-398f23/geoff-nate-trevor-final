FROM python:slim

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv .venv
RUN .venv/bin/pip3 install -r requirements.txt

COPY server.py .

RUN mkdir templates
COPY templates/index.html templates

CMD [".venv/bin/gunicorn", "--bind", "0.0.0.0:8000", "server:app"]