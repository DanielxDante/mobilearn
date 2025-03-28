import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useSegments } from "expo-router";

import { Colors } from "@/constants/colors";
import { memberGuestCoursePage as Constants } from "@/constants/textConstants";
import CourseListItem from "@/components/CourseListItem";
import Course from "@/types/shared/Course/Course";
import CourseSectionTabs from "@/components/CourseSectionTabs";
import useAppStore from "@/store/appStore";
import { useTranslation } from "react-i18next";

const CoursePage = () => {
  const enrolledCourses = useAppStore((state) => state.enrolled_courses);
  const getEnrolledCourses = useAppStore((state) => state.getEnrolledCourses);
  const handleSelectCourse = useAppStore((state) => state.handleSelectCourse);
  const favouriteCourses = useAppStore((state) => state.favourite_courses);
  const getFavouriteCourses = useAppStore((state) => state.getFavouriteCourses);
  const [enrolledData, setEnrolledData] = useState<Course[]>([]);
  const [favouriteData, setFavouriteData] = useState<Course[]>([]);
  const { t } = useTranslation();
  const segments = useSegments();
  useEffect(() => {
    const fetchCourses = async () => {
      await getEnrolledCourses();
      await getFavouriteCourses();
    };
    const currentRoute = segments[segments.length - 1];
    if (currentRoute === "coursePage") {
      fetchCourses();
    }
  }, [segments]);
  useEffect(() => {
    if (enrolledCourses) {
      setEnrolledData(enrolledCourses);
    }
    if (favouriteCourses) {
      setFavouriteData(favouriteCourses);
    }
  }, [enrolledCourses, favouriteCourses]);
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
    const savedCourses = favouriteData;
    const inProgressCourses = enrolledData.filter(
      (course) => course.completion_rate < 100
    );
    const completedCourses = enrolledData.filter(
      (course) => course.completion_rate === 100
    );

    setCourses({
      savedCourses,
      inProgressCourses,
      completedCourses,
    });
  }, [enrolledData, favouriteData]);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <Text style={styles.myCoursesHeader}>
          {t("memberGuestCoursePage.appBarTitle")}
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
        style={[styles.animatedContainer, { transform: [{ translateX }] }]}
      >
        {[0, 1, 2].map((section) => (
          <ScrollView
            key={section}
            style={styles.courseList}
            showsVerticalScrollIndicator={true}
          >
            {getCoursesToDisplay(section).map((course) => (
              <CourseListItem
                key={course.course_id}
                item={course}
                onSelect={() => {
                  handleSelectCourse(course.course_id);
                }}
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
