import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import {
    AppBar,
    Search,
    ContinueWatching,
    SuggestionsSection,
} from "../../types/member_guest";
import { images, temporaryImages } from "../../constants";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";

const Home = () => {
    const [fontsLoaded, error] = useFonts({
        "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
        "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
        "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
        "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
        "Inter-Light": require("@/assets/fonts/Inter-Light.ttf"),
    });

    const router = useRouter();
    // placeholder for channels
    const channelData = [
        { label: "Channel 1", value: "1" },
        { label: "Channel 2", value: "2" },
        { label: "Channel 3", value: "3" },
        { label: "Channel 4", value: "4" },
        { label: "Channel 5", value: "5" },
        { label: "Channel 6", value: "6" },
        { label: "Channel 7", value: "7" },
        { label: "Channel 8", value: "8" },
    ];
    // placeholder for list of search data returned
    const courseListData = [
        { id: "1", title: "First Item" },
        { id: "2", title: "Second Item" },
        { id: "3", title: "Third Item" },
    ];
    // placeholder for list of Continue Watching courses
    const continueWatchingData = [
        {
            id: "1",
            title: "UI/UX Design Essentials",
            school: "Tech innovations University",
            rating: "4.9",
            completionRate: 0.79,
            image: temporaryImages.course1,
        },
        {
            id: "2",
            title: "Graphic Design Fundamentals",
            school: "Creative Arts Institute",
            rating: "4.7",
            completionRate: 0.35,
            image: temporaryImages.course2,
        },
        {
            id: "3",
            title: "Lorem Ipsum 1",
            school: "Smoke University",
            rating: "2.5",
            completionRate: 0.69,
            image: temporaryImages.course2,
        },
    ];
    // placeholder for list of suggestions courses
    const suggestionsData = [
        {
            id: "1",
            title: "UI/UX Design Essentials",
            school: "Tech innovations University",
            rating: "4.9",
            completionRate: 0.79,
            image: temporaryImages.course1,
        },
        {
            id: "2",
            title: "Graphic Design Fundamentals",
            school: "Creative Arts Institute",
            rating: "4.7",
            completionRate: 0.35,
            image: temporaryImages.course2,
        },
        {
            id: "3",
            title: "Lorem Ipsum 1",
            school: "Smoke University",
            rating: "2.5",
            completionRate: 0.69,
            image: temporaryImages.course2,
        },
    ];
    // placeholder for list of Top Courses courses
    const topCourseData = [
        {
            id: "1",
            title: "UI/UX Design Essentials",
            school: "Tech innovations University",
            rating: "4.9",
            completionRate: 0.79,
            image: temporaryImages.course1,
        },
        {
            id: "2",
            title: "Graphic Design Fundamentals",
            school: "Creative Arts Institute",
            rating: "4.7",
            completionRate: 0.35,
            image: temporaryImages.course2,
        },
        {
            id: "3",
            title: "Lorem Ipsum 1",
            school: "Smoke University",
            rating: "2.5",
            completionRate: 0.69,
            image: temporaryImages.course2,
        },
    ];

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    {/* App bar for channel selection and dropdown */}
                    <View style={styles.appBarContainer}>
                        <AppBar options={channelData} />
                    </View>
                    {/* Notification bell icon */}
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => {
                            router.push("/shared/notification");
                        }}
                    >
                        <Image
                            source={images.notifbell}
                            style={styles.notificationIcon}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {/* Search bar */}
                    <View style={styles.searchContainer}>
                        <Search courseListData={courseListData} />
                    </View>
                    {/* Continue Watching */}
                    <View style={styles.continueWatchingContainer}>
                        <ContinueWatching courseData={continueWatchingData} />
                    </View>
                    {/* Suggestions for You */}
                    <View style={styles.suggestionsContainer}>
                        <View style={styles.suggestionsHeader}>
                            <Text style={styles.suggestionsTitle}>
                                Suggestions for You
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push("/suggestionsSeeAll");
                                }}
                            >
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <SuggestionsSection courseData={suggestionsData} />
                    </View>
                    {/* Top Courses */}
                    <View style={styles.topCoursesContainer}>
                        <View style={styles.topCoursesHeader}>
                            <Text style={styles.topCoursesTitle}>
                                Top Courses
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push("/topCoursesSeeAll");
                                }}
                            >
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <SuggestionsSection courseData={topCourseData} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </AutocompleteDropdownContextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        flexDirection: "row",
    },
    appBarContainer: {
        flex: 1,
    },
    notificationButton: {
        padding: 12,
        alignItems: "center",
    },
    notificationIcon: {
        height: 32,
        width: 32,
    },
    searchContainer: {
        marginHorizontal: 20,
        marginVertical: 8,
    },
    continueWatchingContainer: {
        marginTop: 12,
        marginHorizontal: 20,
    },
    suggestionsContainer: {
        marginTop: 12,
    },
    suggestionsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 1,
        marginTop: 8,
    },
    suggestionsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.defaultBlue,
        marginHorizontal: 20,
    },
    seeAllText: {
        color: "#6C6C6C",
        fontSize: 12,
        textDecorationLine: "underline",
        marginRight: 12,
    },
    topCoursesContainer: {
        marginTop: 10,
    },
    topCoursesHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 1,
    },
    topCoursesTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.defaultBlue, // Adjust to your theme color
        marginHorizontal: 20,
    },
});

export default Home;
