FROM python:3.10-slim as base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.10-slim

WORKDIR /app

COPY --from=base /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

COPY --from=base /usr/local/bin /usr/local/bin

COPY app ./app

COPY run.py .

COPY .env .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]