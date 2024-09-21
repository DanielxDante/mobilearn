import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from "react-native";
import React from "react";

import { memberGuestCoursePage as Constants } from "@/constants/TextConstants";
import { Colors } from "@/constants/Colors";

interface CourseSectionTabsProps {
    selectedSection: number;
    onPress: (section: number) => void;
}

const CourseSectionTabs: React.FC<CourseSectionTabsProps> = ({
    selectedSection,
    onPress,
}) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                onPress={() => onPress(0)}
                style={[
                    styles.tab,
                    selectedSection == 0
                        ? styles.activeTab
                        : styles.inactiveTab,
                ]}
            >
                <Text
                    style={
                        selectedSection == 0
                            ? styles.activeTabText
                            : styles.inactiveTabText
                    }
                >
                    {Constants.savedCoursesTitle}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onPress(1)}
                style={[
                    styles.tab,
                    selectedSection == 1
                        ? styles.activeTab
                        : styles.inactiveTab,
                ]}
            >
                <Text
                    style={
                        selectedSection == 1
                            ? styles.activeTabText
                            : styles.inactiveTabText
                    }
                >
                    {Constants.inProgressCoursesTitle}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onPress(2)}
                style={[
                    styles.tab,
                    selectedSection == 2
                        ? styles.activeTab
                        : styles.inactiveTab,
                ]}
            >
                <Text
                    style={
                        selectedSection == 2
                            ? styles.activeTabText
                            : styles.inactiveTabText
                    }
                >
                    {Constants.completedCoursesTitle}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        marginHorizontal: 10,
        marginBottom: 40,
    },
    tab: {
        paddingVertical: 10,
        width: width * 0.28,
        borderRadius: 20,
        backgroundColor: "white",
        borderColor: Colors.defaultBlue,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: Colors.defaultBlue,
    },
    inactiveTab: {
        backgroundColor: "white",
    },
    activeTabText: {
        color: "white",
        fontSize: 12,
        fontFamily: "Inter-Regular",
    },
    inactiveTabText: {
        color: Colors.defaultBlue,
        fontSize: 12,
        fontFamily: "Inter-Regular",
    },
});

export default CourseSectionTabs;
