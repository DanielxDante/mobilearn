FROM python:3.9-slim

# Install OpenMP dependency
RUN apt-get update && apt-get install -y libcurl4-openssl-dev libgomp1

WORKDIR /app

COPY requirements_prod.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

RUN [ "python3", "-c", "import nltk; nltk.download('all', download_dir='/usr/local/nltk_data')" ]

COPY . .

EXPOSE 8080

CMD ["python", "app.py"]