import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Colors } from "@/constants/colors";
import { memberGuestTopCoursesSectionConstants as Constants } from "@/constants/textConstants";
import Course from "@/types/shared/Course/Course";
import useAppStore from "@/store/appStore";
import { useSegments } from "expo-router";
import { MEMBER_GUEST_TABS } from "@/constants/pages";

interface ContinueWatchingProps {
    data: "Suggestions" | "Top Courses";
    onSelect: (id: number) => void;
}

const TopCourses: React.FC<ContinueWatchingProps> = ({
    data, onSelect,
}) => {
    const topEnrolledCourses = useAppStore(
        (state) => state.top_enrolled_courses
    );
    const recommendedCourses = useAppStore(
        (state) => state.recommended_courses
    );
    const getTopEnrolledCourses = useAppStore(
        (state) => state.getTopEnrolledCoursesUser
    );
    const getRecommendedCourses = useAppStore(
        (state) => state.getRecommendedCourses
    );

    const segments = useSegments();
    const currentRoute = segments[segments.length - 1]
    const [courses, setCourses] = useState<Course[]>([]);
    useEffect(() => {
        const fetchCourses = async () => {
            if (data === "Suggestions") {
                await getRecommendedCourses("1", "5", false);
            } else if (data === "Top Courses") {
                await getTopEnrolledCourses("1", "5", false);
            }
            }
        if (currentRoute === MEMBER_GUEST_TABS) {
            fetchCourses();
        }
        }, [currentRoute]);

    useEffect(() => {
        if (data === "Suggestions" && recommendedCourses && recommendedCourses.length>0) {
            setCourses(recommendedCourses.slice(0, 5));
        } else if (data === "Top Courses" && topEnrolledCourses && topEnrolledCourses.length>0) {
            setCourses(topEnrolledCourses.slice(0, 5))
        }
    }, [recommendedCourses, topEnrolledCourses])
    
    
    const renderItem = ({ item }: { item: Course }) => (
        <TouchableOpacity
            style={styles.courseContainer}
            onPress={() => onSelect(item.course_id)}
        >
            <View style={styles.courseInfo}>
                <Image
                    source={{ uri: item.course_image }}
                    style={styles.courseImage}
                />
                <Text style={styles.courseTitle} numberOfLines={2}>
                    {item.course_name}
                </Text>
                <Text
                    style={styles.courseSchool}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.community_name}
                </Text>
                <View style={styles.ratingContainer}>
                    <Image
                        source={Constants.starIcon}
                        style={styles.ratingIcon}
                    />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.listContainer}>
                <FlatList
                    data={courses}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.course_id.toString()}
                    horizontal
                    ListHeaderComponent={
                        <View style={styles.headerFooterSpacing} />
                    }
                    ListFooterComponent={
                        <View style={styles.headerFooterSpacing} />
                    }
                />
            </View>
        </View>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    courseContainer: {
        marginHorizontal: 12,
        marginBottom: 20,
        width: width * 0.35,
        height: height * 0.23,
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    courseImage: {
        width: "100%",
        height: height * 0.12,
        resizeMode: "cover",
        borderRadius: 5,
        marginBottom: 4,
    },
    courseInfo: {
        marginTop: 1,
        width: 140,
    },
    courseTitle: {
        fontFamily: "Inter-Medium",
        color: Colors.defaultBlue,
        fontSize: 14,
        lineHeight: 20,
        minHeight: 43,
    },
    courseSchool: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: Colors.defaultBlue,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingIcon: {
        height: 16,
        width: 16,
    },
    ratingText: {
        fontSize: 10,
        paddingHorizontal: 4,
        paddingTop: 1,
        fontFamily: "Inter-Regular",
    },
    listContainer: {
        flexDirection: "row",
    },
    headerFooterSpacing: {
        width: 15,
    },
});

export default TopCourses;
