import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";

import { Colors } from "@/constants/colors";
import CourseListItem from "@/components/InstructorCourseListItem";
import Course from "@/types/shared/Course/Course";
import { memberGuestTopCoursesSeeAll as Constants } from "@/constants/textConstants";
import { COURSE_GET_TOP_COURSES_INSTRUCTOR } from "@/constants/routes";
import useAuthStore from "@/store/authStore";

const LIMIT = 20; // Set the maximum number of courses to fetch

const TopCoursesSeeAll = () => {
    const [page, setPage] = useState(1);
    const token = useAuthStore((state) => state.access_token);

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { suggestions } = useLocalSearchParams();
    const parsedSuggestions: Course[] =
        typeof suggestions === "string" ? JSON.parse(suggestions) : [];

    const [topCourseData, setTopCourseData] = useState(() => {
        // Remove duplicates from initial suggestions
        const courses = parsedSuggestions.map((course: any) => ({
            ...course,
            course_id: course.id, // Add a `course_id` field based on `id`
        }));
        const uniqueCourses = new Map(courses.map((c) => [c.course_id, c]));
        return Array.from(uniqueCourses.values());
    });

    const fetchCourses = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const url =
            COURSE_GET_TOP_COURSES_INSTRUCTOR + `?page=${page}&per_page=5`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch courses");
            }

            const data = await response.json();
            console.log("Fetched courses:", data);

            const newCourses = data.courses.flat();
            const courses = newCourses.map((course: any) => ({
                ...course,
                course_id: course.id, // Add a `course_id` field based on `id`
            }));

            // Remove duplicates by using a Map
            const uniqueCourses = new Map([
                ...topCourseData.map((c) => [c.course_id, c]),
                ...courses.map((c) => [c.course_id, c]),
            ]);

            const updatedCourses = Array.from(uniqueCourses.values());

            // Update state and check if limit is reached
            setTopCourseData(updatedCourses);
            if (updatedCourses.length >= LIMIT) {
                setHasMore(false); // Stop further fetching if limit is reached
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (topCourseData.length < LIMIT && hasMore) {
            fetchCourses();
        }
    }, [page]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleSelectCourse = (id: string) => {
        console.log("Course " + id + " Selected");
        const courseSelected = topCourseData.find(
            (course) => course.course_id.toString() === id
        );
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
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Image
                        source={Constants.backButton}
                        style={styles.backButton}
                    />
                </TouchableOpacity>
                <Text style={styles.suggestionsHeader}>
                    {Constants.appBarTitle}
                </Text>
            </View>
            {/* Suggestions Display Section */}
            <View>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    onMomentumScrollEnd={handleLoadMore} // Load more when scrolling ends
                >
                    {topCourseData.map((course) => (
                        <CourseListItem
                            key={course.course_id}
                            item={course}
                            onSelect={handleSelectCourse}
                        />
                    ))}
                    {loading && (
                        <Text style={styles.loadingText}>Loading...</Text>
                    )}
                    {!hasMore && (
                        <Text style={styles.endText}>
                            No more courses available
                        </Text>
                    )}
                </ScrollView>
            </View>
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
    scrollContainer: {
        paddingBottom: 20,
    },
    suggestionsHeader: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-Regular",
        marginLeft: 25,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: "bold",
    },
    loadingText: {
        textAlign: "center",
        padding: 10,
        color: Colors.defaultBlue,
    },
    endText: {
        textAlign: "center",
        padding: 10,
        color: Colors.defaultBlue,
        fontSize: 16,
    },
});

export default TopCoursesSeeAll;
