FROM python:3.12-alpine as back

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./back /app

ENV PYTHONUNBUFFERED=1

ENV DB_PATH="sqlite:///app/database/news-site_back.db"

CMD ["python", "main.py"]

FROM node:22-alpine as web

WORKDIR /app

COPY ./web/package*.json ./

RUN npm install --legacy-peer-deps

COPY ./web .

RUN npm run build --if-present

CMD [ "npm", "run", "deploy"]

