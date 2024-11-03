import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import VideoPlayer from "@/components/VideoPlayer";
import Course from "@/types/shared/Course/Course";
import { courseDetailsConstants as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import icons from "@/constants/icons";

const CourseDetails = () => {
    // CONSTANTS TO BE USED UNTIL COURSE DATA IS FINALISED
    const numLectures = 50;
    const learningTime = "4 Weeks";
    const certicationType = "Online Certification";
    const skills = [
        "Typography",
        "Layout Composition",
        "Branding",
        "Visual communication",
        "Editorial design",
    ];

    const { courseSelected } = useLocalSearchParams();
    const course: Course =
        typeof courseSelected === "string" ? JSON.parse(courseSelected) : [];

    const handleSkillPress = (skill: string) => {
        console.log(skill);
    };
    return (
        <SafeAreaView>
            <ScrollView>
                <VideoPlayer
                    uri={
                        "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
                    }
                />
                {/* Course Information */}
                <View style={styles.container}>
                    <Text style={styles.title}>{course.title}</Text>
                    <Text style={styles.school}>{course.school}</Text>
                    <View style={styles.enrolledCountContainer}>
                        <Image
                            source={icons.userCount}
                            style={styles.enrolledCountIcon}
                        />
                        <Text style={styles.enrolledCount}>
                            {course.enrolledCount}
                            {Constants.enrolledCountText}
                        </Text>
                    </View>
                    <Text style={styles.courseDetailsHeader}>
                        {Constants.courseDetails}
                    </Text>
                    <Text style={styles.courseDescription}>
                        {course.description}
                    </Text>
                    {/* Course Information Lecture/Learning Time/Certification */}
                    <View style={styles.courseInfo}>
                        <View style={styles.courseInfoLeft}>
                            <View style={styles.courseInfoLeftTitle}>
                                <Image
                                    source={icons.lecture}
                                    style={styles.courseInfoLeftIcon}
                                />
                                <Text style={styles.courseInfoLeftText}>
                                    {Constants.lecture}
                                </Text>
                            </View>
                            <View style={styles.courseInfoLeftTitle}>
                                <Image
                                    source={icons.clock}
                                    style={styles.courseInfoLeftIcon}
                                />
                                <Text style={styles.courseInfoLeftText}>
                                    {Constants.learningTime}
                                </Text>
                            </View>
                            <View style={styles.courseInfoLeftTitle}>
                                <Image
                                    source={icons.certification}
                                    style={styles.courseInfoLeftIcon}
                                />
                                <Text style={styles.courseInfoLeftText}>
                                    {Constants.certification}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.courseInfoRight}>
                            <Text style={styles.courseInfoRightText}>
                                {numLectures}
                                {Constants.numLectures}
                            </Text>
                            <Text style={styles.courseInfoRightText}>
                                {learningTime}
                            </Text>
                            <Text style={styles.courseInfoRightText}>
                                {certicationType}
                            </Text>
                        </View>
                    </View>
                    {/* Skills section */}
                    <View>
                        <Text style={styles.skillsTitle}>
                            {Constants.skillsTitle}
                        </Text>
                        <View style={styles.skillsContainer}>
                            {skills.map((skill, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.skillButton}
                                    onPress={() => handleSkillPress(skill)}
                                >
                                    <Text style={styles.skillText}>
                                        {skill}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    {/* Enroll now button */}
                    <View>
                        <TouchableOpacity
                            style={styles.enrollNowButton}
                            onPress={() =>
                                router.push({
                                    pathname: "./paymentOverview",
                                    params: {
                                        courseSelected: courseSelected,
                                    },
                                })
                            }
                        >
                            <Text style={styles.enrollNowButtonText}>
                                {Constants.enrollNowButton}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        paddingHorizontal: 25,
    },
    title: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        marginTop: 15,
        fontSize: 20,
    },
    school: {
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
        marginTop: 1,
        fontSize: 12,
    },
    enrolledCountContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3,
    },
    enrolledCount: {
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
        fontSize: 9,
    },
    enrolledCountIcon: {
        height: 12,
        width: 12,
        marginRight: 3,
    },
    courseDetailsHeader: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 18,
        marginTop: 20,
        marginBottom: 8,
    },
    courseDescription: {
        fontFamily: "Inter-Regular",
        color: "#6C6C6C",
        fontSize: 11,
    },
    courseInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    courseInfoLeft: {
        flexDirection: "column",
        flex: 6,
    },
    courseInfoLeftTitle: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 5,
    },
    courseInfoLeftIcon: {
        height: 17,
        width: 17,
        marginRight: 5,
        resizeMode: "contain",
    },
    courseInfoLeftText: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 13,
    },
    courseInfoRight: {
        flexDirection: "column",
        justifyContent: "flex-start",
        flex: 5,
    },
    courseInfoRightText: {
        fontFamily: "Inter-SemiBold",
        color: "#6C6C6C",
        fontSize: 13,
        paddingTop: 5,
    },
    skillsTitle: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 18,
        paddingTop: 20,
        marginBottom: 10,
    },
    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    skillButton: {
        borderColor: "#DEDEDE",
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 4,
    },
    skillText: {
        fontSize: 12,
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
    },
    enrollNowButton: {
        backgroundColor: Colors.defaultBlue,
        marginTop: 20,
        marginBottom: 40,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    enrollNowButtonText: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
        color: "#DEDEDE",
    },
});

export default CourseDetails;
