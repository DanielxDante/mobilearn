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

import { Colors } from "@/constants/colors";
//import { instructorCoursePageConstants as textConstants } from "@/constants/textConstants";
import CourseListItem from "@/components/InstructorCourseListItem";
import SearchBar from "../../../components/SearchBar";
import useAuthStore from "@/store/authStore";
import Course from "@/types/shared/Course/Course";
import useAppStore from "@/store/appStore";
import {
  INSTRUCTOR_COURSECONTENT,
  INSTRUCTOR_CREATE_COURSE,
} from "@/constants/pages";
import { useTranslation } from "react-i18next";
//import { instructorCoursePageConstants } from "@/locales/en";

const CoursePage = () => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const { t } = useTranslation();
  const getCourseDetails = useAppStore((state) => state.getCourseDetails);
  const getInstructorCourses = useAppStore(
    (state) => state.getInstructorCourses
  );
  const instructorCourse_approved = useAppStore(
    (state) => state.instructor_courses
  );
  useEffect(() => {
    const fetchCourses = async () => {
      await getInstructorCourses();
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(instructorCourse_approved);
  }, [instructorCourse_approved]);

  const handleSelectCourse = async (id: string) => {
    const courseSelected = filteredCourses.find(
      (course) => course.course_id.toString() === id
    );
    if (courseSelected?.course_id !== undefined) {
      try {
        await getCourseDetails(courseSelected.course_id.toString());
        router.push({
          pathname: INSTRUCTOR_COURSECONTENT,
        });
      } catch (error) {
        console.error("Error getting course details)", error);
      }
    } else {
      console.error("Course ID is undefined");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        <Text style={styles.myCoursesHeader}>
          {t("instructorCoursePageConstants.appBarTitle")}
        </Text>
        <TouchableOpacity
          style={styles.createCourseButton}
          onPress={() => {
            router.push(INSTRUCTOR_CREATE_COURSE);
          }}
        >
          <Text style={styles.createCourseButtonText}>
            {t("instructorCoursePageConstants.createCourseText")}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <SearchBar
          placeholder={t("instructorCoursePageConstants.searchBarPlaceholder")}
          courseListData={instructorCourse_approved}
          onSearchResultsChange={setFilteredCourses} // Update the list when search results change
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredCourses.map((course) => (
          <CourseListItem
            key={course.course_id}
            item={course}
            onSelect={handleSelectCourse}
          />
        ))}
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  myCoursesHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.defaultBlue,
  },
  createCourseButton: {
    padding: 5,
    backgroundColor: Colors.tabsIconGray,
    borderRadius: 5,
  },
  createCourseButtonText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  searchContainer: {
    marginHorizontal: 0,
    marginVertical: 4,
  },
  courseList: {
    width,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default CoursePage;
