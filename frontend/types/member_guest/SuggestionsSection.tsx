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

import { images } from "../../constants";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";

interface Course {
    id: string;
    title: string;
    school: string;
    rating: string;
    completionRate: number;
    image: any;
}

interface ContinueWatchingProps {
    courseData: Course[];
}

const SuggestionsSection: React.FC<ContinueWatchingProps> = ({
    courseData,
}) => {
    const [fontsLoaded, error] = useFonts({
        "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
        "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
        "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
        "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
        "Inter-Light": require("@/assets/fonts/Inter-Light.ttf"),
    });

    const first3Courses = courseData.slice(0, 3);

    const renderItem = ({ item }: { item: Course }) => (
        <TouchableOpacity style={styles.courseContainer}>
            <View style={styles.courseInfo}>
                <Image
                    source={item.image}
                    style={styles.courseImage}
                    resizeMode="contain"
                />
                <Text style={styles.courseTitle} numberOfLines={2}>
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
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.listContainer}>
                <FlatList
                    data={first3Courses}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    ListHeaderComponent={
                        <View style={styles.headerFooterSpacing} />
                    }
                    ListFooterComponent={
                        <View style={styles.headerFooterSpacing} />
                    }
                />
            </View>
        </View>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    courseContainer: {
        marginHorizontal: 6,
        marginBottom: 20,
        width: width * 0.35,
        height: height * 0.23,
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    courseImage: {
        width: "100%",
    },
    courseInfo: {
        marginTop: 1,
        width: 140,
    },
    courseTitle: {
        fontFamily: "Inter-Medium",
        color: Colors.defaultBlue,
        fontSize: 15,
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
        fontFamily: "Inter-Regular",
    },
    listContainer: {
        flexDirection: "row",
    },
    headerFooterSpacing: {
        width: 12,
    },
});

export default SuggestionsSection;
