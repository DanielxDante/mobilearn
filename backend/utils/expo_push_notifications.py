# Device-agnostic push notification functions for Expo

import json
import requests

def send_push_notification(expo_token, title, body):
    """
    Send a push notification to a device
    """
    try:
        response = requests.post(
            "https://exp.host/--/api/v2/push/send",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            data=json.dumps({
                "to": expo_token,
                "sound": "default",
                "title": title,
                "body": body,
            })
        )

        if not response.ok:
            error_data = response.json()
            raise ValueError(f"Failed to send notification: {error_data.get('message', response.reason)}")
    except Exception as e:
        print(f"Error sending notification: {e}")
        raise
