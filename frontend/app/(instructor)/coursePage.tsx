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

import { courseListData as allCourses } from "@/constants/temporaryCourseData";
import { Colors } from "@/constants/colors";
import { instructorCoursePageConstants as textConstants } from "@/constants/textConstants";
import CourseListItem from "@/components/InstructorCourseListItem";
import SearchBar from "../../components/SearchBar";
const CoursePage = () => {
  const [filteredCourses, setFilteredCourses] = useState(allCourses);

  const handleSelectCourse = (id: string) => {
    console.log("Course " + id + " Selected");
    const courseSelected = filteredCourses.find(
      (course) => course.id.toString() === id
    );
    router.push({
      pathname: "../../shared/course/courseContent",
      params: {
        courseSelected: JSON.stringify(courseSelected),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        <Text style={styles.myCoursesHeader}>{textConstants.appBarTitle}</Text>
        <TouchableOpacity
          style={styles.createCourseButton}
          onPress={() => {
            router.push("../shared/course/createCoursePage");
          }}
        >
          <Text style={styles.createCourseButtonText}>
            {textConstants.createCourseText}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <SearchBar
          placeholder={textConstants.searchBarPlaceholder}
          courseListData={allCourses}
          onSearchResultsChange={setFilteredCourses} // Update the list when search results change
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredCourses.map((course) => (
          <CourseListItem
            key={course.id}
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
