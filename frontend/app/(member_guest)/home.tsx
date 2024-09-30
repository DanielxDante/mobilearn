import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import {
    AppBar,
    Search,
    ContinueWatching,
    SuggestionsSection,
    TopCourses,
} from "../../components/member_guest";
import {
    channelData,
    courseListData,
    continueWatchingData,
    suggestionsData,
    topCourseData,
} from "@/constants/temporaryCourseData";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/colors";
import { memberGuestHomeConstants as Constants } from "@/constants/textConstants";

const Home = () => {
    const [fontsLoaded, error] = useFonts({
        "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
        "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
        "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
        "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
        "Inter-Light": require("@/assets/fonts/Inter-Light.ttf"),
    });

    const router = useRouter();

    const handleSelectCourse = (id: string) => {
        // TODO: INCLUDE COURSE NAVIGATION
        console.log("Course " + id + " Selected");
    };

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    {/* App bar for channel selection and dropdown */}
                    <View style={styles.appBarContainer}>
                        <AppBar options={channelData} />
                    </View>
                    {/* Notification bell icon */}
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => {
                            router.push("/shared/notification");
                        }}
                    >
                        <Image
                            source={Constants.notifBellButton}
                            style={styles.notificationIcon}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {/* Search bar */}
                    <View style={styles.searchContainer}>
                        <Search courseListData={courseListData} />
                    </View>
                    {/* Continue Watching */}
                    <View style={styles.continueWatchingContainer}>
                        <ContinueWatching
                            courseData={continueWatchingData}
                            onSelect={handleSelectCourse}
                        />
                    </View>
                    {/* Suggestions for You */}
                    <View style={styles.suggestionsContainer}>
                        <View style={styles.suggestionsHeader}>
                            <Text style={styles.suggestionsTitle}>
                                {Constants.suggestionsSubHeader}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({
                                        pathname: "/suggestionsSeeAll",
                                        params: {
                                            suggestions:
                                                JSON.stringify(suggestionsData),
                                        },
                                    });
                                }}
                            >
                                <Text style={styles.seeAllText}>
                                    {Constants.seeAllText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <SuggestionsSection
                            courseData={suggestionsData}
                            onSelect={handleSelectCourse}
                        />
                    </View>
                    {/* Top Courses */}
                    <View style={styles.topCoursesContainer}>
                        <View style={styles.topCoursesHeader}>
                            <Text style={styles.topCoursesTitle}>
                                {Constants.topCoursesSubHeader}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({
                                        pathname: "/topCoursesSeeAll",
                                        params: {
                                            suggestions:
                                                JSON.stringify(topCourseData),
                                        },
                                    });
                                }}
                            >
                                <Text style={styles.seeAllText}>
                                    {Constants.seeAllText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TopCourses
                            courseData={topCourseData}
                            onSelect={handleSelectCourse}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </AutocompleteDropdownContextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        flexDirection: "row",
    },
    appBarContainer: {
        flex: 1,
    },
    notificationButton: {
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    notificationIcon: {
        height: 32,
        width: 32,
    },
    searchContainer: {
        marginHorizontal: 20,
        marginVertical: 8,
    },
    continueWatchingContainer: {
        marginTop: 12,
        marginHorizontal: 20,
    },
    suggestionsContainer: {
        marginTop: 12,
    },
    suggestionsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 1,
        marginTop: 8,
    },
    suggestionsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.defaultBlue,
        marginHorizontal: 20,
    },
    seeAllText: {
        color: "#6C6C6C",
        fontSize: 12,
        textDecorationLine: "underline",
        marginRight: 12,
    },
    topCoursesContainer: {
        marginTop: 10,
    },
    topCoursesHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 1,
    },
    topCoursesTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.defaultBlue, // Adjust to your theme color
        marginHorizontal: 20,
    },
});

export default Home;
