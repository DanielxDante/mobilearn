import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";
import { Colors } from "@/constants/colors";
import NotificationItem from "@/components/NotificationItem";
import BackButton from "@/components/BackButton";
import { notificationsConstants as Constants } from "@/constants/textConstants";
import notification from "@/types/shared/notification";
import { set } from "lodash";
import { useTranslation } from "react-i18next";

// placeholder for notification data
// const notificationData: AppNotification[] = [
//     {
//         type: "success",
//         title: "Transaction Completed!",
//         subtitle: "Payment has been made to Daniel Inc.",
//         timestamp: "2024-09-19T10:00:00Z",
//     },
//     {
//         type: "success",
//         title: "Transaction Completed!",
//         subtitle: "Payment has been made to Gerard Pte Ltd.",
//         timestamp: "2024-09-19T09:30:00Z",
//     },
//     {
//         type: "failure",
//         title: "Due Date is Near",
//         subtitle: "Submit course 1 to avoid a penalty",
//         timestamp: "2024-09-19T09:25:00Z",
//     },
//     {
//         type: "completed",
//         title: "Lesson Completed!",
//         subtitle: "Payment has been made to Matthew Corp.",
//         timestamp: "2024-09-19T12:30:00Z",
//     },
// ];

const sort = (notificationData: notification[]) => {
  const sortedNotification = notificationData.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  return sortedNotification;
};

const Notification = () => {
  // Accept passed-in params
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  // Parse the `notifications` parameter
  const notificationData = React.useMemo(() => {
    let data =
      typeof params.notifications === "string"
        ? JSON.parse(params.notifications) // Parse the `notifications` key
        : [];
    return sort(data); // Sort the parsed data
  }, [params]);

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <BackButton />
        <Text style={styles.notificationHeader}>
          {t("notificationsConstants.pageTitle")}
        </Text>
      </View>
      {/* Notification Area */}
      <FlatList
        data={notificationData} // Use parsed data here
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item.timestamp}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appBarContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  notificationHeader: {
    color: Colors.defaultBlue,
    fontFamily: "Plus-Jakarta-Sans",
    marginLeft: 25,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
});

export default Notification;
