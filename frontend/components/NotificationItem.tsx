import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";

import Icons from "@/constants/icons";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/colors";
import { TimeAgo } from "./TimeAgo";
import notification from "@/types/shared/notification";
import { useTranslation } from "react-i18next";

// export interface AppNotification {
//   type: "success" | "failure" | "completed";
//   title: string;
//   subtitle: string;
//   timestamp: string;
// }

interface NotificationItemProps {
  notification: notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { t } = useTranslation();

  // Define translations for notification titles based on type
  const notificationTitles: { [key: string]: string } = {
    info: t("notificationsConstants.infoTitle", "Information"),
    payment: t("notificationsConstants.paymentTitle", "Payment Update"),
    course: t("notificationsConstants.courseTitle", "Course Update"),
    chat: t("notificationsConstants.chatTitle", "New Message"),
  };

  // Assign default title if type is not found
  const title =
    notificationTitles[notification.notification_type] ||
    t("notificationsConstants.defaultTitle", "Notification");

  let icon;
  let iconBackground;
  let redBackgroundSize = { width: 50, height: 50 };
  let blueBackgroundSize = { width: 60, height: 60 };
  switch (notification.notification_type) {
    case "success":
      icon = Icons.successIcon;
      iconBackground = Icons.blueBackground;
      break;
    case "warning":
      icon = Icons.failureIcon;
      iconBackground = Icons.redBackground;
      break;
    case "info":
      icon = Icons.completedIcon;
      iconBackground = Icons.blueBackground;
      break;
    default:
      icon = Icons.completedIcon;
      iconBackground = Icons.blueBackground;
  }
  console.log(notification);

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.imageAndDescriptionContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={iconBackground}
            style={
              iconBackground === Icons.redBackground
                ? redBackgroundSize
                : blueBackgroundSize
            }
            resizeMode="contain"
          />
          <Image source={icon} style={styles.icon} />
        </View>
        <View style={styles.description}>
          <Text style={styles.title} numberOfLines={1}>
            {title} {/* Use the mapped title */}
          </Text>
          <Text style={styles.timestamp}>
            {TimeAgo(notification.timestamp)}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {notification.body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EAF4FF",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imageAndDescriptionContainer: {
    flexDirection: "row",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: 60,
    height: 60,
  },
  icon: {
    width: 24,
    height: 24,
    position: "absolute",
  },
  description: {
    marginLeft: 12,
    justifyContent: "center",
    maxWidth: 220,
  },
  title: {
    fontFamily: "Plus-Jakarta-Sans",
    color: Colors.defaultBlue,
    fontWeight: "600",
    fontSize: 16,
  },
  subtitle: {
    fontFamily: "Plus-Jakarta-Sans",
    color: "#6C6C6C",
    fontSize: 12,
    marginTop: 4,
  },
  timeStampContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  timestamp: {
    fontFamily: "Plus-Jakarta-Sans",
    color: "#6C6C6C",
    fontSize: 10,
  },
});

export default NotificationItem;
