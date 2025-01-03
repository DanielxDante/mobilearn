import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";

import { Colors } from "@/constants/colors";
import { memberGuestContinueWatchingConstants as Constants } from "@/constants/textConstants";
import Course from "@/types/shared/Course/Course";

interface ContinueWatchingProps {
    courseData: Course[];
    onSelect: (id: number) => void;
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({
    courseData,
    onSelect,
}) => {
    const first2Courses = courseData.slice(0, 2);

    const renderItem = (item: Course) => (
        <TouchableOpacity key={item.id} onPress={() => onSelect(item.id)}>
            <View style={styles.courseContainer}>
                <Image source={item.image} style={styles.courseImage} />
                <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.courseSchool}>{item.school}</Text>
                    <View style={styles.ratingContainer}>
                        <Image
                            source={Constants.starIcon}
                            style={styles.ratingIcon}
                        />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <Progress.Bar
                            progress={item.completionRate}
                            color="#356FC5"
                            borderColor="#D9D9D9"
                            unfilledColor="#D9D9D9"
                            width={null}
                        />
                        <View style={styles.progressTextContainer}>
                            <Text style={styles.progressText}>
                                {item.completionRate * 100}
                                {Constants.completionRateText}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <Text style={styles.headerText}>
                {Constants.continueWatchingSubtitle}
            </Text>
            {first2Courses.map(renderItem)}
        </View>
    );
};

const styles = StyleSheet.create({
    courseContainer: {
        borderWidth: 1,
        borderColor: "#DFDFDF", // Equivalent to slate-100
        shadowColor: "#000", // Set shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Set shadow offset for iOS
        shadowOpacity: 0.25, // Set shadow opacity for iOS
        shadowRadius: 3.5, // Set shadow radius for iOS
        borderRadius: 8,
        marginTop: 12,
        flexDirection: "row",
        paddingHorizontal: 8,
        alignItems: "center",
    },
    courseImage: {
        width: 80,
        height: 60,
        resizeMode: "cover",
        borderRadius: 5,
    },
    courseInfo: {
        paddingHorizontal: 12,
        flex: 1,
    },
    courseTitle: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 16,
    },
    courseSchool: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: Colors.defaultBlue, // Replace with your default blue
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
        fontFamily: "Inter-Regular",
    },
    progressContainer: {
        flexDirection: "column",
    },
    progressTextContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    progressText: {
        fontSize: 10,
        fontFamily: "Inter-Regular",
        color: "#6B7280", // Equivalent to slate-500
        marginRight: 4,
    },
    headerText: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        color: Colors.defaultBlue, // Replace with your default blue
    },
});

export default ContinueWatching;
