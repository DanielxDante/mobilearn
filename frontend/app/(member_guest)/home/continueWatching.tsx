import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import * as Progress from "react-native-progress";

import { Colors } from "@/constants/colors";
import { memberGuestContinueWatchingConstants as Constants } from "@/constants/textConstants";
import Course from "@/types/shared/Course/Course";
import useAppStore from "@/store/appStore";
import { useSegments } from "expo-router";
import { MEMBER_GUEST_TABS } from "@/constants/pages";

interface ContinueWatchingProps {
    onSelect: (id: number) => void;
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({
    onSelect,
}) => {
    const enrolledCourses = useAppStore((state) => state.enrolled_courses);
    const getEnrolledCourses = useAppStore((state) => state.getEnrolledCourses);
    const [courses, setCourses] = useState<Course[]>([]);

    const segments = useSegments();
    useEffect(() => {
        const fetchCourses = async () => {
            await getEnrolledCourses();
        }
        const currentRoute = segments[segments.length - 1]
        console.log(currentRoute)
        if (currentRoute === MEMBER_GUEST_TABS) {
            fetchCourses();
        }
    }, []);

    useEffect(() => {
        if (enrolledCourses && enrolledCourses.length > 0) {
            setCourses(enrolledCourses.slice(0, 2));
        }
    }, [enrolledCourses]);
    const renderItem = (item: Course) => (
        <TouchableOpacity
            key={item.course_id}
            onPress={() => onSelect(item.course_id)}
        >
            <View style={styles.courseContainer}>
                <Image
                    source={{ uri: item.course_image }}
                    style={styles.courseImage}
                />
                <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle} numberOfLines={1}>
                        {item.course_name}
                    </Text>
                    <Text style={styles.courseSchool} numberOfLines={1}>
                        {item.community_name}
                    </Text>
                    <View style={styles.ratingContainer}>
                        <Image
                            source={Constants.starIcon}
                            style={styles.ratingIcon}
                        />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    {(item.completion_rate != undefined) ? (
                        <View style={styles.progressContainer}>
                            <Progress.Bar
                                progress={item.completion_rate}
                                color="#356FC5"
                                borderColor="#D9D9D9"
                                unfilledColor="#D9D9D9"
                                width={null}
                            />
                            <View style={styles.progressTextContainer}>
                                <Text style={styles.progressText}>
                                    {item.completion_rate * 100}
                                    {Constants.completionRateText}
                                </Text>
                            </View>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            {
                (courses?.length > 0) && (
                    <>
                        <Text style={styles.headerText}>
                            {Constants.continueWatchingSubtitle}
                        </Text>
                        {courses.map(renderItem)}
                    </>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    courseContainer: {
        borderWidth: 1,
        borderColor: "#DFDFDF", // Equivalent to slate-100
        shadowColor: "#000", // Set shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Set shadow offset for iOS
        shadowOpacity: 0.25, // Set shadow opacity for iOS
        shadowRadius: 3.5, // Set shadow radius for iOS
        borderRadius: 8,
        marginTop: 12,
        flexDirection: "row",
        paddingHorizontal: 8,
        alignItems: "center",
    },
    courseImage: {
        width: 80,
        height: 60,
        resizeMode: "cover",
        borderRadius: 5,
    },
    courseInfo: {
        paddingHorizontal: 12,
        flex: 1,
    },
    courseTitle: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 16,
    },
    courseSchool: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: Colors.defaultBlue, // Replace with your default blue
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
        fontFamily: "Inter-Regular",
    },
    progressContainer: {
        flexDirection: "column",
    },
    progressTextContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    progressText: {
        fontSize: 10,
        fontFamily: "Inter-Regular",
        color: "#6B7280", // Equivalent to slate-500
        marginRight: 4,
    },
    headerText: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        color: Colors.defaultBlue, // Replace with your default blue
    },
});

export default ContinueWatching;
