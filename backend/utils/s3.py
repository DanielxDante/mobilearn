import os
import boto3
from botocore.exceptions import ClientError

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)
bucket_name = os.getenv('S3_BUCKET')
cloudfront_domain = os.getenv('CLOUDFRONT_DOMAIN')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {
        # Images
        'png',
        'jpg',
        'jpeg',
        'gif',
        'webp',
        # Videos
        'mp4',
        'avi',
        'mov',
        'wmv',
        'flv',
        'mkv',
        'webm',
        # Homework
        'pdf',
        'doc',
        'docx',
    }

def upload_file(file, prefix):
    if file.filename == '':
        raise ValueError("No file selected for uploading")
    if file and allowed_file(file.filename):
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f'{prefix}{file_extension}'

        try:
            base_filename = os.path.splitext(unique_filename)[0]
            response = s3_client.list_objects_v2(
                Bucket=bucket_name,
                Prefix=base_filename
            )
            if 'Contents' in response:
                for obj in response['Contents']:
                    s3_client.delete_object(
                        Bucket=bucket_name,
                        Key=obj['Key']
                    )
        except ClientError as e:
            if e.response['Error']['Code'] != '404':
                raise
        
        s3_client.upload_fileobj(
            file,
            bucket_name,
            unique_filename,
            ExtraArgs={
                'ContentType': file.content_type,
                'CacheControl': 'max-age=1'
            }
        )

        image_url = f'https://{cloudfront_domain}/{unique_filename}'

        return image_url
    else:
        raise ValueError("Invalid file format")