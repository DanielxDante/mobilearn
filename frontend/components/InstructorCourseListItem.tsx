import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import React from "react";

import images from "@/constants/images";
import { Colors } from "@/constants/colors";
import icons from "@/constants/icons";
import Course from "@/types/shared/Course/Course";
import { instructorCourseListItemsConstants as textConstants } from "@/constants/textConstants";

interface CourseListItemProps {
  item: Course;
  onSelect: (id: string) => void;
}

const CourseListItem: React.FC<CourseListItemProps> = ({ item, onSelect }) => {
  return (
    <TouchableOpacity
      style={styles.courseContainer}
      onPress={() => onSelect(item.id.toString())}
    >
      <Image
        source={item.image}
        style={styles.courseImage}
        resizeMode="cover"
      />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text
          style={styles.courseSchool}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.school}
        </Text>
        <View style={styles.ratingContainer}>
          <Image source={images.starRating} style={styles.ratingIcon} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text
          style={styles.courseDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
        <View style={styles.lastRowContainer}>
          <Text style={styles.buttonStyle}>{textConstants.viewCourse}</Text>
          <View style={styles.userCountContainer}>
            <Image source={icons.userCount} style={styles.userCountImage} />
            <Text style={styles.userCount}>{item.enrolledCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  courseContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  courseImage: {
    width: width * 0.25,
    height: height * 0.18,
    borderRadius: 8,
    marginRight: 10,
  },
  courseInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.defaultBlue,
    marginBottom: 4,
  },
  courseSchool: {
    fontSize: 12,
    color: Colors.defaultBlue,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.defaultBlue,
  },
  courseDescription: {
    fontSize: 12,
    color: "#757575",
    lineHeight: 16,
  },
  lastRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  buttonStyle: {
    fontSize: 12,
    color: "white",
    backgroundColor: Colors.defaultBlue,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 5,
    overflow: "hidden",
  },
  userCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userCountImage: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  userCount: {
    fontSize: 12,
    color: Colors.defaultBlue,
  },
});

export default CourseListItem;
