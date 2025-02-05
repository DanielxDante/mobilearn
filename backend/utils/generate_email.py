import qrcode
import base64
from io import BytesIO

def generate_qr_code(reset_url, size=10, border=4):
    """
    Generate a QR code for the reset URL
    
    :param reset_url: URL to encode in QR code
    :param size: QR code size (default 10)
    :param border: QR code border size (default 4)
    :return: Base64 encoded PNG of the QR code
    """
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=size,
        border=border,
    )
    
    # Add data
    qr.add_data(reset_url)
    qr.make(fit=True)
    
    # Create an image from the QR code
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Save the image to a BytesIO object
    qr_io = BytesIO()
    qr_image.save(qr_io, format="PNG")
    qr_io.seek(0)

    return qr_io

def generate_reset_email_html(reset_url):
    return f'''
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
        <h2>Reset Your Password</h2>

        <p>Scan this QR code to reset your password:</p>

        <img src="cid:qr_code" 
             alt="Password Reset QR Code" 
             style="max-width: 150px; height: auto; margin: 20px 0;"
        />

        <p style="font-size: 14px; color: #666; word-break: break-all;">
            Or manually enter this link:<br>
            {reset_url}
        </p>

        <p style="font-size: 12px; color: #999;">
            @ MobiLearn 2025. This QR code will expire in 1 hour.
        </p>
    </body>
    </html>
    '''