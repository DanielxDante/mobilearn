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
import { router } from "expo-router";

import { courseListData } from "@/constants/temporaryCourseData";
import { Colors } from "@/constants/colors";
import { memberGuestCoursePage as Constants } from "@/constants/textConstants";
import CourseListItem from "@/components/InstructorCourseListItem";
import Course from "@/types/shared/Course/Course";
import CourseSectionTabs from "@/components/CourseSectionTabs";

const CoursePage = () => {
  const handleSelectCourse = (id: string) => {
    // TODO: INCLUDE COURSE NAVIGATION
    console.log("Course " + id + " Selected");
    const courseSelected = courseListData.find(
      (course) => course.id.toString() === id
    );
    router.push({
      pathname: "../../shared/course/courseDetails",
      params: {
        courseSelected: JSON.stringify(courseSelected),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <Text style={styles.myCoursesHeader}>{Constants.appBarTitle}</Text>
        {/* CREATE COURSE BUTTON EDIT THIS */}
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
      {/* Course list */}
      {courseListData.map((course) => (
        <CourseListItem
          key={course.id}
          item={course}
          onSelect={handleSelectCourse}
        />
      ))}
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
  courseList: {
    width,
  },
});

export default CoursePage;
