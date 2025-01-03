import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";

import { Colors } from "@/constants/colors";
import { memberGuestTopCoursesSectionConstants as Constants } from "@/constants/textConstants";
import Course from "@/types/shared/Course/Course";

interface ContinueWatchingProps {
  courseData: Course[];
  onSelect: (id: number) => void;
}

const TopCourses: React.FC<ContinueWatchingProps> = ({
  courseData,
  onSelect,
}) => {
  const courses = courseData.map((course: any) => ({
    ...course,
    course_id: course.id, // Add a `course_id` field based on `id`
  }));

  const first3Courses = courses.slice(0, 3);

  const renderItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseContainer}
      onPress={() => onSelect(item.course_id)}
    >
      <View style={styles.courseInfo}>
        <Image source={{ uri: item.course_image }} style={styles.courseImage} />
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.course_name}
        </Text>
        <Text
          style={styles.courseSchool}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.community_name}
        </Text>
        <View style={styles.ratingContainer}>
          <Image source={Constants.starIcon} style={styles.ratingIcon} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.listContainer}>
        <FlatList
          data={first3Courses}
          renderItem={renderItem}
          keyExtractor={(item) => item.course_id.toString()}
          horizontal
          ListHeaderComponent={<View style={styles.headerFooterSpacing} />}
          ListFooterComponent={<View style={styles.headerFooterSpacing} />}
        />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  courseContainer: {
    marginHorizontal: 12,
    marginBottom: 20,
    width: width * 0.35,
    height: height * 0.23,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  courseImage: {
    width: "100%",
    height: height * 0.12,
    resizeMode: "cover",
    borderRadius: 5,
    marginBottom: 4,
  },
  courseInfo: {
    marginTop: 1,
    width: 140,
  },
  courseTitle: {
    fontFamily: "Inter-Medium",
    color: Colors.defaultBlue,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 43,
  },
  courseSchool: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Colors.defaultBlue,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingIcon: {
    height: 16,
    width: 16,
  },
  ratingText: {
    fontSize: 10,
    paddingHorizontal: 4,
    paddingTop: 1,
    fontFamily: "Inter-Regular",
  },
  listContainer: {
    flexDirection: "row",
  },
  headerFooterSpacing: {
    width: 15,
  },
});

export default TopCourses;
