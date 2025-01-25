import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Colors } from "@/constants/colors";
import CourseListItem from "@/components/InstructorCourseListItem";
import Course from "@/types/shared/Course/Course";
import { memberGuestTopCoursesSeeAll as Constants } from "@/constants/textConstants";
import useAppStore from "@/store/appStore";
import { INSTRUCTOR_COURSE_DETAILS } from "@/constants/pages";

const LIMIT = 20; // Set the maximum number of courses to fetch

const TopCoursesSeeAll = () => {
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const topEnrolledCourses = useAppStore((state) => state.top_enrolled_courses);
  const getTopEnrolledCourses = useAppStore(
    (state) => state.getTopCoursesInstructor
  );

  const [topCourseData, setTopCourseData] =
    useState<Course[]>(topEnrolledCourses);

  const fetchCourses = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextFiveCourses = await getTopEnrolledCourses(page.toString(), "5");
    setTopCourseData((prevData) => [...prevData, ...nextFiveCourses]);
    setLoading(false);
    if (topCourseData.length >= LIMIT) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (topCourseData.length < LIMIT && hasMore) {
      fetchCourses();
    }
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSelectCourse = (id: string) => {
    console.log("Course " + id + " Selected");
    const courseSelected = topCourseData.find(
      (course) => course.course_id.toString() === id
    );
    console.log("Course selected:", courseSelected);
    router.push({
      pathname: INSTRUCTOR_COURSE_DETAILS,
      params: {
        courseId: id.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Image source={Constants.backButton} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.suggestionsHeader}>{Constants.appBarTitle}</Text>
      </View>
      {/* Suggestions Display Section */}
      <View style={styles.scrollContainerOutside}>
        <ScrollView
          onMomentumScrollEnd={handleLoadMore} // Load more when scrolling ends
        >
          {topCourseData.map((course) => (
            <CourseListItem
              key={course.course_id}
              item={course}
              onSelect={handleSelectCourse}
            />
          ))}
          {loading && <Text style={styles.loadingText}>Loading...</Text>}
          {!hasMore && (
            <Text style={styles.endText}>No more courses available</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appBarContainer: {
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "center",
  },
  backButton: {
    height: 25,
    width: 25,
    marginLeft: 25,
    padding: 5,
  },
  scrollContainerOutside: {
    flex: 1,
  },
  suggestionsHeader: {
    color: Colors.defaultBlue,
    fontFamily: "Inter-Regular",
    marginLeft: 25,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    padding: 10,
    color: Colors.defaultBlue,
  },
  endText: {
    textAlign: "center",
    padding: 10,
    color: Colors.defaultBlue,
    fontSize: 16,
  },
});

export default TopCoursesSeeAll;
