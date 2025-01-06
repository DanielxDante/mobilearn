import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useSegments } from "expo-router";
import TopCourses from "@/app/(instructor)/home/topCourses";
import { MEMBER_GUEST_TABS } from "@/constants/pages";
import useAuthStore from "@/store/authStore";

import { Colors } from "@/constants/colors";
import { memberGuestHomeConstants as Constants } from "@/constants/textConstants";
import Statistics from "@/components/Statistics";
import LatestNews from "@/components/LatestNews";
import { instructorHomePageConstants as textConstants } from "@/constants/textConstants";
import { COURSE_GET_TOP_COURSES_INSTRUCTOR } from "@/constants/routes";

const statsData = [
    { label: "Your Course", value: "23", description: "Lesson" },
    { label: "Your Audience", value: "10,458", change: "-23.47%" },
    { label: "Avg. Watch Time", value: "35 min", change: "+23.47%" },
    { label: "Reviews", value: "20,254", change: "+23.47%" },
];

const newsData = [
    {
        title: "The Effects of Temperature on Enzyme Activity and Biology",
        category: "Biology",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        title: "Advances in Quantum Computing",
        category: "Technology",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        title: "Global Warming and Its Impact on Agriculture",
        category: "Environment",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
];

const Home = () => {
    const segments = useSegments();
    const token = useAuthStore((state) => state.access_token);
    const [page, setPage] = useState(1);
    const [topCourseData, setTopCourseData] = useState([]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                // Get the current route
                const currentRoute = segments[segments.length - 1];
                // If we're on the member home page, go to hardware home
                if (currentRoute === MEMBER_GUEST_TABS) {
                    BackHandler.exitApp(); // Exit the app
                    return true;
                }

                return false;
            }
        );
        return () => backHandler.remove();
    }, [router, segments]);

    useEffect(() => {
        const fetchCourses = async () => {
            const url =
                COURSE_GET_TOP_COURSES_INSTRUCTOR + `?page=${page}&per_page=5`;
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json", // Matches `-H 'accept: application/json'` from the curl
                        Authorization: token, // Matches `-H 'Authorization: Bearer ...'` from the curl
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch courses");
                }
                const data = await response.json();
                console.log("Top courses data:", data);
                setTopCourseData(data.courses);
            } catch (error) {
                console.error("Error fetching courses for home page:", error);
            }
        };
        fetchCourses();
    }, [token, page]);

    const handleSelectCourse = (id: number) => {
        // TODO: INCLUDE COURSE NAVIGATION
        console.log("Course " + id + " Selected");
        const courseSelected = topCourseData.find((course) => course.id === id);
        console.log("Course selected:", courseSelected);
        router.push({
            pathname: "../../shared/course/courseDetails",
            params: {
                courseSelected: id.toString(),
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.appBarContainer}>
                {/* App bar for Home and notifications*/}
                <Text style={styles.homePageHeader}>
                    {textConstants.pageTitle}
                </Text>
                {/* Notification bell icon */}
                <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={() => {
                        router.push("/shared/notification");
                    }}
                >
                    <Image
                        source={Constants.notifBellButton}
                        style={styles.notificationIcon}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {/* Statistics */}
                <Statistics stats={statsData} />
                {/* Top Courses */}
                <View>
                    <View style={styles.topCoursesHeader}>
                        <Text style={styles.topCoursesTitle}>
                            {Constants.topCoursesSubHeader}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                router.push({
                                    pathname:
                                        "/(instructor)/home/topCoursesSeeAll",
                                    params: {
                                        suggestions:
                                            JSON.stringify(topCourseData),
                                    },
                                });
                            }}
                        >
                            <Text style={styles.seeAllText}>
                                {Constants.seeAllText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TopCourses
                        courseData={topCourseData}
                        onSelect={handleSelectCourse}
                    />
                </View>
                {/* News */}
                <LatestNews news={newsData} />
            </ScrollView>
        </SafeAreaView>
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
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "space-between",
    },
    homePageHeader: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-Regular",
        marginLeft: 25,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: "bold",
    },
    notificationButton: {
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    notificationIcon: {
        height: 32,
        width: 32,
    },
    seeAllText: {
        color: "#6C6C6C",
        fontSize: 12,
        textDecorationLine: "underline",
        marginRight: 12,
    },
    topCoursesHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    topCoursesTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.defaultBlue, // Adjust to your theme color
        marginHorizontal: 20,
    },
});

export default Home;
