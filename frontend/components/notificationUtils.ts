import { notificationUtility as Constants } from "@/constants/textConstants";

// notificationUtils.ts

export const sendNotification = async (
  expoToken: string,
  title: string,
  body: string
): Promise<void> => {
  if (!expoToken) {
    throw new Error(Constants.pushTokenRequiredError);
  }

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        to: expoToken,
        sound: "default",
        title,
        body,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `${Constants.failedSendNotification}${
          errorData?.message || response.statusText
        }`
      );
    }

    console.log(Constants.notificationSuccess);
  } catch (error) {
    console.error(Constants.errorSendingNotification, error);
    throw error;
  }
};
