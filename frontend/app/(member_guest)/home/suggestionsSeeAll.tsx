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
import { router } from "expo-router";

import { Colors } from "@/constants/colors";
import CourseListItem from "@/components/CourseListItem";
import Course from "@/types/shared/Course/Course";
import { memberGuestSuggestionsSeeAll as Constants } from "@/constants/textConstants";
import useAppStore from "@/store/appStore";

const LIMIT = 20; // Set the maximum number of courses to fetch

const SuggestionsSeeAll = () => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const recommendedCourses = useAppStore(
        (state) => state.recommended_courses
    );
    const getRecommendedCourses = useAppStore(
        (state) => state.getRecommendedCourses
    );

    const [suggestionData, setSuggestionData] =
        useState<Course[]>(recommendedCourses);

    const handleSelectCourse = (id: string) => {
        // TODO: INCLUDE COURSE NAVIGATION
        console.log("Course " + id + " Selected");
    };

    const fetchCourses = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextFiveCourses = await getRecommendedCourses(
            page.toString(),
            "5",
            true
        );
        setSuggestionData((prevData) => [...prevData, ...nextFiveCourses]);
        setLoading(false);
        if (suggestionData.length >= LIMIT) {
            setHasMore(false);
        }
    };
    console.log("Page: " + page);

    useEffect(() => {
        if (suggestionData.length < LIMIT && hasMore) {
            fetchCourses();
        }
    }, [page]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
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
            {/* Suggestions Display section */}
            <View style={styles.scrollContainerOutside}>
                <ScrollView
                    onMomentumScrollEnd={handleLoadMore} // Load more when scrolling ends
                >
                    {suggestionData.map((course) => (
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
        marginVertical: 15,
        alignItems: "center",
    },
    backButton: {
        height: 25,
        width: 25,
        marginLeft: 25,
        padding: 5,
    },
    scrollContainerOutside: {
        flex: 1,
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

export default SuggestionsSeeAll;
