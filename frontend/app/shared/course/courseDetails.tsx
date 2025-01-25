import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import Course from "@/types/shared/Course/Course";
import { courseDetailsConstants as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import icons from "@/constants/icons";
import useAuthStore from "@/store/authStore";
import useAppStore from "@/store/appStore";
import BackButton from "@/components/BackButton";
import FavouriteButton from "@/components/FavouriteButton";

const CourseDetails = () => {
  // CONSTANTS TO BE USED UNTIL COURSE DATA IS FINALISED
  const certicationType = "Online Certification";

  const { courseId } = useLocalSearchParams();

  const handleSkillPress = (skill: string) => {
    console.log(skill);
  };
  const handleCommunitySelect = () => {
    router.push({
      pathname: "../communityPage",
      params: {
        communityId: courseData?.community_id,
        communityName: courseData?.community_name,
      },
    });
  };

  const [courseData, setCourseData] = useState<Course | null>(null);
  const getUnenrolledCourse = useAppStore((state) => state.getUnenrolledCourse);
  const membership = useAuthStore((state) => state.membership);
  const [course_image, setCourseImage] = useState<string>("");

  const membership_types = ["normal", "member", "core_member"];

  useEffect(() => {
    const fetchCourseData = async () => {
      const data = await getUnenrolledCourse(Number(courseId));
      setCourseData(data);
      setCourseImage(data.course_image);
    };
    fetchCourseData();
  }, [courseId]);
  const { width: screenWidth } = Dimensions.get("window");
  const [imageHeight, setImageHeight] = useState(0);
  useEffect(() => {
    if (course_image) {
      Image.getSize(course_image, (width, height) => {
        const aspectRatio = width / height;
        const calculatedHeight = screenWidth / aspectRatio;
        setImageHeight(calculatedHeight);
      });
    }
  }, [course_image]);

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <BackButton />
        {membership && membership_types.includes(membership) && (
        <FavouriteButton course_id={courseId.toString()} />
        )}
      </View>
      <ScrollView style={styles.body}>
        {/* if picture is not available, show loading */}
        {course_image ? (
          <Image
            source={{ uri: course_image }}
            style={[styles.courseImage, { height: imageHeight }]}
            resizeMode="cover"
          />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {/* Course Information */}
        {courseData && (
          <View style={styles.courseDetails}>
            <Text style={styles.title}>{courseData.course_name}</Text>
            <TouchableOpacity onPress={handleCommunitySelect}>
              <Text style={styles.school}>{courseData.community_name}</Text>
            </TouchableOpacity>
            <View style={styles.enrolledCountContainer}>
              <Image
                source={icons.userCount}
                style={styles.enrolledCountIcon}
              />
              <Text style={styles.enrolledCount}>
                {courseData.enrollment_count ? courseData.enrollment_count : 0}
                {Constants.enrolledCountText}
              </Text>
            </View>
            <Text style={styles.courseDetailsHeader}>
              {Constants.courseDetails}
            </Text>
            <Text style={styles.courseDescription}>
              {courseData.description}
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
                  {courseData.lesson_count}
                  {Constants.numLectures}
                </Text>
                <Text style={styles.courseInfoRightText}>
                  {courseData.duration}
                </Text>
                <Text style={styles.courseInfoRightText}>
                  {certicationType}
                </Text>
              </View>
            </View>
            {/* Skills section */}
            <View>
              <Text style={styles.skillsTitle}>{Constants.skillsTitle}</Text>
              <View style={styles.skillsContainer}>
                {courseData.skills.split(", ").map((skill, index) => (
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
            {/* Enroll now button */}
            {membership && membership_types.includes(membership) && (
              <View>
                <TouchableOpacity
                  style={styles.enrollNowButton}
                  onPress={() =>
                    router.push({
                      pathname: "./paymentOverview",
                      params: {
                        courseId: courseData.course_id,
                      },
                    })
                  }
                >
                  <Text style={styles.enrollNowButtonText}>
                    {Constants.enrollNowButton}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!courseData && <ActivityIndicator size="large" color="#0000ff" />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  appBarContainer: {
    flexDirection: "row",
    marginVertical: 13,
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  body: {
    flex: 1,
  },
  courseDetails: {
    justifyContent: "flex-start",
    paddingHorizontal: 25,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    color: Colors.defaultBlue,
    marginTop: 15,
    fontSize: 20,
  },
  courseImage: {
    width: "100%",
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
