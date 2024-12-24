# Want to run our backend?

## Getting Started

1. Set up virtual environment

```bash
conda create -n mobilearn python=3.9
conda activate mobilearn
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Create .env file for runtime variables and populate the following:

```bash
POSTGRES_DB=postgres
POSTGRES_USER=mobilearn
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
JWT_SECRET_KEY=*********
AWS_ACCESS_KEY_ID=*********
AWS_SECRET_ACCESS_KEY=***************
AWS_REGION=**-******-*
S3_BUCKET=***********
CLOUDFRONT_DOMAIN=************.cloudfront.net
ADMIN_API_KEY=*******************************
```

4. Run dockerised PostgreSQL cli instance

```bash
docker compose up -d
```

> Ensure you do not have another psql instance running on the same port
>
> To make sure your docker instance is up, run psql cli instance locally with: psql -h localhost -U mobilearn -d postgres

5. Run flask app

```bash
python app.py
```

6. After your coding sesh, shut down the docker PostgreSQL instance by running:

```bash
docker compose down --volumes
```

