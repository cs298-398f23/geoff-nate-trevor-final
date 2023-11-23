FROM python:slim

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv .venv
RUN .venv/bin/pip3 install -r requirements.txt

COPY collector.py .
COPY scraper.py .

CMD [".venv/bin/python", "collector.py"]