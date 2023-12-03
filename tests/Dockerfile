FROM python:slim

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv .venv
RUN .venv/bin/pip3 install -r requirements.txt

COPY test_app.py .
COPY expected_results.json .

CMD [".venv/bin/pytest", "-v", "-s", "test_app.py"]