import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";

import icons from "../../constants/Icons";
import { Colors } from "@/constants/Colors";
import images from "@/constants/images";

const SuggestionsSeeAll = () => {
    const [fontsLoaded, error] = useFonts({
        "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
        "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
        "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
        "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
        "Inter-Light": require("@/assets/fonts/Inter-Light.ttf"),
    });

    const { suggestions } = useLocalSearchParams();
    const parsedSuggestions: Course[] =
        typeof suggestions === "string" ? JSON.parse(suggestions) : [];
    console.log(parsedSuggestions);
    const renderItem = ({ item }: { item: Course }) => (
        <TouchableOpacity style={styles.courseContainer}>
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

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Image
                        source={icons.backButton}
                        style={styles.backButton}
                    />
                </TouchableOpacity>
                <Text style={styles.suggestionsHeader}>
                    Suggestions for You
                </Text>
            </View>
            {/* Suggestions Display section */}
            <View>
                <View style={styles.listContainer}>
                    <FlatList
                        data={parsedSuggestions}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={
                            <View style={styles.headerFooterSpacing} />
                        }
                        ListFooterComponent={
                            <View style={styles.headerFooterSpacing} />
                        }
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    appBarContainer: {
        flexDirection: "row",
        marginTop: 20,
        alignItems: "center",
    },
    backButton: {
        height: 25,
        width: 25,
        marginLeft: 25,
        padding: 5,
    },
    suggestionsHeader: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-Regular",
        marginLeft: 25,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: "bold",
    },
    courseContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        height: height * 0.19,
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
        width: "30%",
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
    listContainer: {
        flexDirection: "row",
        marginTop: 40,
    },
    headerFooterSpacing: {
        width: 12,
    },
});

export default SuggestionsSeeAll;
