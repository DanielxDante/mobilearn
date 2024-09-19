import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { router } from "expo-router";

import icons from "../../constants/Icons";
import { Colors } from "@/constants/Colors";
import NotificationItem, {
    AppNotification,
} from "@/types/shared/NotificationItem";

// placeholder for notification data
const notificationData: AppNotification[] = [
    {
        type: "success",
        title: "Transaction Completed!",
        subtitle: "Payment has been made to Daniel Inc.",
        timestamp: "2024-09-19T10:00:00Z",
    },
    {
        type: "success",
        title: "Transaction Completed!",
        subtitle: "Payment has been made to Gerard Pte Ltd.",
        timestamp: "2024-09-19T09:30:00Z",
    },
    {
        type: "failure",
        title: "Due Date is Near",
        subtitle: "Submit course 1 to avoid a penalty",
        timestamp: "2024-09-19T09:25:00Z",
    },
    {
        type: "completed",
        title: "Lesson Completed!",
        subtitle: "Payment has been made to Matthew Corp.",
        timestamp: "2024-09-19T12:30:00Z",
    },
];

const sortedNotification = notificationData.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
});

const Notification = () => {
    const [fontsLoaded, error] = useFonts({
        "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
        "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
        "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
        "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
        "Inter-Light": require("@/assets/fonts/Inter-Light.ttf"),
        "Plus-Jakarta-Sans": require("@/assets/fonts/PlusJakartaSans.ttf"),
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Image
                        source={icons.backButton}
                        style={styles.backButton}
                    />
                </TouchableOpacity>
                <Text style={styles.notificationHeader}>Notification</Text>
            </View>
            {/* Notification Area */}
            <FlatList
                data={notificationData}
                renderItem={({ item }) => (
                    <NotificationItem notification={item} />
                )}
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
    backButton: {
        height: 25,
        width: 25,
        marginLeft: 25,
        padding: 5,
    },
    notificationHeader: {
        color: Colors.defaultBlue,
        fontFamily: "Plus-Jakarta-Sans",
        marginLeft: 25,
        paddingBottom: 2,
        fontSize: 25,
        fontWeight: "bold",
    },
    listContainer: {
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
});

export default Notification;
