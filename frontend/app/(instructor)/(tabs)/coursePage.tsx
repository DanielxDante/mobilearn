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

//import { courseListData as allCourses } from "@/constants/temporaryCourseData";
import { Colors } from "@/constants/colors";
import { instructorCoursePageConstants as textConstants } from "@/constants/textConstants";
import CourseListItem from "@/components/InstructorCourseListItem";
import SearchBar from "../../../components/SearchBar";
import {
  COURSE_GET_ALL_INSTRUCTOR_COURSES,
  COURSE_GET_ENROLLED_COURSE,
} from "@/constants/routes";
import useAuthStore from "@/store/authStore";
import Course from "@/types/shared/Course/Course";

const CoursePage = () => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const token = useAuthStore((state) => state.access_token); // Move the hook here

  useEffect(() => {
    // Fetch all courses with authorization token
    const fetchCourses = async () => {
      try {
        const response = await fetch(COURSE_GET_ALL_INSTRUCTOR_COURSES, {
          method: "GET",
          headers: {
            Accept: "application/json", // Matches `-H 'accept: application/json'` from the curl
            Authorization: token, // Matches `-H 'Authorization: Bearer ...'` from the curl
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();

        // Map over the data to transform `name` into `title`, because the component expects `title`
        const active_courses = data.active_courses.map((course: any) => ({
          ...course,
          course_id: course.id, // Add a `course_id` field based on `id`
          //course_name: course.name, // Add a `title` field based on `name`
          course_image: course.image, // Add a `course_image` field based on `image`

          // name: undefined, // Optionally remove the `name` field
        }));

        const not_approved_courses = data.not_approved_courses.map(
          (course: any) => ({
            ...course,
            course_id: course.id, // Add a `course_id` field based on `id`
            //course_name: course.name, // Add a `title` field based on `name`
            course_image: course.image, // Add a `course_image` field based on `image`
          })
        );

        setFilteredCourses(active_courses);
        //console.log(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (token) {
      fetchCourses(); // Call fetch only if token is available
    }
  }, [token]); // Add token as a dependency

  const handleSelectCourse = async (id: string) => {
    console.log("Course " + id + " Selected");
    const courseSelected = filteredCourses.find(
      (course) => course.course_id.toString() === id
    );
    const path = COURSE_GET_ENROLLED_COURSE + "/" + id;
    const response = await fetch(path, {
      method: "GET",
      headers: {
        Accept: "application/json", // Matches `-H 'accept: application/json'` from the curl
        Authorization: token, // Matches `-H 'Authorization: Bearer ...'` from the curl
        course_id: courseSelected?.course_id.toString(), // Add the course ID as a header
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    const data = await response.json();
    console.log("Course Info: ", data);

    router.push({
      pathname: "../../shared/course/instructorCourseContent",
      params: {
        courseSelected: JSON.stringify(data),
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
          courseListData={filteredCourses}
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
