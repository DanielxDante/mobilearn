import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";
import React from "react";

import images from "@/constants/Images";
import { Colors } from "@/constants/Colors";
import icons from "../../constants/Icons";
import Course from "./Course";

interface CourseListItemProps {
    item: Course;
    onSelect: (id: string) => void;
}

const CourseListItem: React.FC<CourseListItemProps> = ({ item, onSelect }) => {
    return (
        <TouchableOpacity
            style={styles.courseContainer}
            onPress={() => onSelect(item.id)}
        >
            <Image
                source={item.image}
                style={styles.courseImage}
                resizeMode="cover"
            />
            <View style={styles.courseInfo}>
                <Text style={styles.courseTitle} numberOfLines={1}>
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
                    <Image
                        source={images.starRating}
                        style={styles.ratingIcon}
                    />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <Text numberOfLines={2} style={styles.courseDescription}>
                    {item.description}
                </Text>
                <View style={styles.userCountContainer}>
                    <Image
                        source={icons.userCount}
                        style={styles.userCountImage}
                    />
                    <Text style={styles.userCount}>{item.enrolledCount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
    courseContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        height: height * 0.18,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DFDFDF", // Equivalent to slate-100
        shadowColor: "#000", // Set shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Set shadow offset for iOS
        shadowOpacity: 0.25, // Set shadow opacity for iOS
        shadowRadius: 3.5, // Set shadow radius for iOS
        borderRadius: 8,
    },
    courseImage: {
        width: "28%",
        height: "80%",
        margin: 15,
        borderRadius: 5,
    },
    courseInfo: {
        marginTop: 1,
        width: "60%",
        flexDirection: "column",
    },
    courseTitle: {
        fontFamily: "Inter-Medium",
        color: Colors.defaultBlue,
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 6,
    },
    courseSchool: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: Colors.defaultBlue,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    ratingIcon: {
        height: 16,
        width: 16,
    },
    ratingText: {
        fontSize: 10,
        paddingHorizontal: 4,
        paddingTop: 2,
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
    },
    courseDescription: {
        fontSize: 10,
        fontFamily: "Inter-Regular",
        marginBottom: 5,
    },
    userCountContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    userCountImage: {
        height: 12,
        width: 12,
        marginRight: 3,
    },
    userCount: {
        fontSize: 10,
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
    },
});

export default CourseListItem;
