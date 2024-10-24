import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { paymentOverviewConstants as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import BackButton from "@/components/BackButton";
import PaymentProgressBar from "@/components/PaymentProgressBar";
import { useLocalSearchParams } from "expo-router";
import Course from "@/types/shared/Course";
import icons from "@/constants/icons";

const PaymentOverview = () => {
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
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton />
            </View>
            <ScrollView>
                {/* Progress Bar */}
                <PaymentProgressBar active={1} />
                {/* Title */}
                <View style={styles.titleView}>
                    <Text style={styles.title}>{Constants.title}</Text>
                </View>
                {/* Course title */}
                <View style={styles.courseTitleContainer}>
                    <Text style={styles.courseTitle}>
                        {Constants.courseNameSubtitle}
                    </Text>
                    <Text style={styles.courseName}>{course.title}</Text>
                </View>
                {/* Course Info */}
                <View style={styles.courseInfoContainer}>
                    <View style={styles.courseInfo}>
                        <Image
                            source={icons.lecture}
                            style={styles.courseInfoIcon}
                        />
                        <Text style={styles.courseInfoText}>
                            {"   "}
                            {numLectures}
                            {Constants.numLectures}
                        </Text>
                    </View>
                    <View style={styles.courseInfo}>
                        <Image
                            source={icons.clock}
                            style={styles.courseInfoIcon}
                        />
                        <Text style={styles.courseInfoText}>
                            {"   "}
                            {learningTime}
                        </Text>
                    </View>
                    <View style={styles.courseInfo}>
                        <Image
                            source={icons.certification}
                            style={styles.courseInfoIcon}
                        />
                        <Text style={styles.courseInfoText}>
                            {"   "}
                            {certicationType}
                        </Text>
                    </View>
                </View>
                {/* Skills section */}
                <View style={styles.skillSection}>
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
                                <Text style={styles.skillText}>{skill}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appBarContainer: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 30,
        alignItems: "center",
    },
    titleView: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    title: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 22,
    },
    courseTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    courseTitle: {
        marginLeft: 20,
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 15,
    },
    courseName: {
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
        fontSize: 14,
    },
    courseInfoContainer: {
        marginLeft: 25,
        marginTop: 20,
    },
    courseInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    courseInfoIcon: {
        height: 17,
        width: 17,
        marginRight: 5,
        resizeMode: "contain",
    },
    courseInfoText: {
        fontFamily: "Inter-Regular",
        color: "#6C6C6C",
        fontSize: 13,
    },
    skillSection: {
        marginLeft: 25,
        marginTop: 20,
    },
    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    skillsTitle: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 15,
        marginBottom: 10,
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
});

export default PaymentOverview;
