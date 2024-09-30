import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Animated,
    FlatList,
    ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { courseListData } from "@/constants/temporaryCourseData";
import { Colors } from "@/constants/colors";
import { memberGuestCoursePage as Constants } from "@/constants/textConstants";
import courseListItem from "@/types/shared/courseListItem";
import Course from "@/types/shared/Course";
import { useFonts } from "expo-font";
import CourseSectionTabs from "@/components/member_guest/CourseSectionTabs";
import CourseListItem from "@/types/shared/courseListItem";

const CoursePage = () => {
    const [fontsLoaded, error] = useFonts({
        "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
        "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
        "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
        "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
        "Inter-Light": require("@/assets/fonts/Inter-Light.ttf"),
    });
    // selectedSection: 0 for Saved, 1 for In Progress, 2 for Completed
    const [selectedSection, setSelectedSection] = useState(0);
    const [courses, setCourses] = useState<{
        savedCourses: Course[];
        inProgressCourses: Course[];
        completedCourses: Course[];
    }>({
        savedCourses: [],
        inProgressCourses: [],
        completedCourses: [],
    });

    // FILTER AND SET COURSES BASED ON COMPLETION RATE
    useEffect(() => {
        const savedCourses = courseListData.filter(
            (course) => course.completionRate === 0
        );
        const inProgressCourses = courseListData.filter(
            (course) => course.completionRate > 0 && course.completionRate < 1
        );
        const completedCourses = courseListData.filter(
            (course) => course.completionRate === 1
        );

        setCourses({
            savedCourses,
            inProgressCourses,
            completedCourses,
        });
    }, []);

    const getCoursesToDisplay = (section: number) => {
        switch (section) {
            case 0:
                return courses.savedCourses;
            case 1:
                return courses.inProgressCourses;
            case 2:
                return courses.completedCourses;
            default:
                return [];
        }
    };

    // ANIMATION BETWEEN HEADERS
    const animatedValue = useRef(new Animated.Value(0)).current;

    const animateSection = (newSection: number) => {
        Animated.timing(animatedValue, {
            toValue: newSection,
            duration: 200,
            useNativeDriver: true,
        }).start();
        setSelectedSection(newSection);
    };

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, -width, -2 * width],
    });

    const handleSelectCourse = (id: string) => {
        // TODO: INCLUDE COURSE NAVIGATION
        console.log("Course " + id + " Selected");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <Text style={styles.myCoursesHeader}>
                    {Constants.appBarTitle}
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
            {/* Section tabs */}
            <CourseSectionTabs
                selectedSection={selectedSection}
                onPress={animateSection}
            />
            {/* 3 Category Course List with Animated Slide */}
            <Animated.View
                style={[
                    styles.animatedContainer,
                    { transform: [{ translateX }] },
                ]}
            >
                {[0, 1, 2].map((section) => (
                    <ScrollView
                        key={section}
                        style={styles.courseList}
                        showsVerticalScrollIndicator={true}
                    >
                        {getCoursesToDisplay(section).map((course) => (
                            <CourseListItem
                                key={course.id}
                                item={course}
                                onSelect={handleSelectCourse}
                            />
                        ))}
                    </ScrollView>
                ))}
            </Animated.View>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    appBarContainer: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "space-between",
    },
    myCoursesHeader: {
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
        marginRight: 12,
    },
    notificationIcon: {
        height: 32,
        width: 32,
    },
    animatedContainer: {
        flexDirection: "row",
        width: width * 3,
        flex: 1,
    },
    courseList: {
        width,
    },
});

export default CoursePage;
