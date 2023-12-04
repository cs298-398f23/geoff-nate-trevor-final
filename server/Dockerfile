FROM python:slim

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv .venv
RUN .venv/bin/pip3 install -r requirements.txt

COPY server.py .

RUN mkdir templates
COPY templates/index.html templates

RUN mkdir static
COPY static/style.css static
COPY static/script.js static

CMD [".venv/bin/gunicorn", "-w4", "--bind", "0.0.0.0:80", "server:app"]