# Push Notifications for FCM Android Devices

# Push Notifications for ACN Android Devices

def android_send_push_notification(device_id, title, message, data):
    try:
        # Get the device token
        device = Device.objects.get(device_id=device_id)
        device_token = device.device_token

        # Send the push notification
        push_service = FCMNotification(api_key=settings.FCM_API_KEY)
        result = push_service.notify_single_device(registration_id=device_token, message_title=title, message_body=message, data_message=data)

        # Log the result
        logger.info(f"Push notification sent to device {device_id} with title {title} and message {message}. Result: {result}")
    except Exception as e:
        logger.error(f"Error sending push notification to device {device_id}. Error: {e}")

def ios_send_push_notification(device_id, title, message, data):
    try:
        # Get the device token
        device = Device.objects.get(device_id=device_id)
        device_token = device.device_token

        # Send the push notification
        apns = APNs(use_sandbox=settings.APNS_USE_SANDBOX, cert_file=settings.APNS_CERT_FILE, key_file=settings.APNS_KEY_FILE)
        payload = Payload(alert=message, sound="default", badge=1, custom=data)
        apns.gateway_server.send_notification(device_token, payload)

        # Log the result
        logger.info(f"Push notification sent to device {device_id} with title {title} and message {message}")
    except Exception as e:
        logger.error(f"Error sending push notification to device {device_id}. Error: {e}")