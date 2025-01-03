import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { memberGuestProfilePage as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/store/authStore";
import { useFonts } from "expo-font";
import IconTextButton from "@/components/IconTextButton";
import icons from "@/constants/icons";
import { router } from "expo-router";
import { CAROUSEL_PAGE, DONATION_PAGE } from "@/constants/pages";

const Profile = () => {
    const username = useAuthStore((state) => state.username);
    const email = useAuthStore((state) => state.email);
    const profile_picture_url = useAuthStore(
        (state) => state.profile_picture_url
    );

    const logout = useAuthStore((state) => state.logout);

    const profile_picture = profile_picture_url
        ? { uri: profile_picture_url, cache: "reload" }
        : Constants.default_profile_picture;

    const handleLogout = async () => {
        if (username != "") {
            // console.log("Attempting logout");
            await logout();
        }
        router.push(CAROUSEL_PAGE);
        console.log("Member logout");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <Text style={styles.myCoursesHeader}>
                    {Constants.appBarTitle}
                </Text>
            </View>
            {/* Profile details */}
            <View style={styles.profileDetails}>
                <View style={styles.profileLeftItems}>
                    <Image
                        source={profile_picture}
                        style={styles.profilePicture}
                        onError={(error) =>
                            console.error(
                                "Error loading image: ",
                                error.nativeEvent.error
                            )
                        }
                    />
                    <View style={styles.profileText}>
                        <Text style={styles.name} numberOfLines={1}>
                            {username}
                        </Text>
                        <Text style={styles.email} numberOfLines={1}>
                            {email}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editIconButton}
                    onPress={() => {
                        router.push("/(member_guest)/profile/editProfile");
                    }}
                >
                    <Image
                        source={Constants.editIcon}
                        style={styles.editIcon}
                    />
                </TouchableOpacity>
            </View>
            {/* Options Area */}
            <View style={styles.optionsContainer}>
                {/* TODO: replace payment method with changing language */}
                <IconTextButton
                    icon={icons.card}
                    text={Constants.paymentMethodTitle}
                    onPress={() => {
                        router.push(
                            "/(member_guest)/profile/userPaymentMethod"
                        );
                    }}
                    style={styles.iconTextButton}
                />
                {/* TODO: add help center and privacy notice here */}
                <IconTextButton
                    icon={icons.tele}
                    text={Constants.donateTitle}
                    onPress={() => {
                        router.push(DONATION_PAGE);
                    }}
                    style={styles.iconTextButton}
                />
                <IconTextButton
                    icon={icons.logout}
                    text={Constants.logOutTitle}
                    onPress={handleLogout}
                    style={styles.iconTextButton}
                />
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
        marginTop: 28,
        alignItems: "center",
        justifyContent: "space-between",
    },
    myCoursesHeader: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-Regular",
        marginLeft: 25,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: "bold",
    },
    profileDetails: {
        flexDirection: "row",
        marginTop: 30,
        paddingBottom: 20,
        marginHorizontal: 30,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#CECECE",
    },
    profileLeftItems: {
        flexDirection: "row",
        alignItems: "center",
    },
    profilePicture: {
        width: 100,
        height: 100,
        backgroundColor: "#D9D9D9",
        shadowColor: "rgba(0, 67, 76, 0.25)",
        shadowOpacity: 1,
        shadowRadius: 5,
        borderRadius: 50,
        marginRight: 15,
    },
    profileText: {
        flexDirection: "column",
    },
    name: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: Colors.defaultBlue,
        letterSpacing: 0.3,
    },
    email: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: "#6C6C6C",
        letterSpacing: 0.3,
    },
    editIconButton: {
        padding: 3,
    },
    editIcon: {
        height: 23,
        width: 23,
    },
    optionsContainer: {
        flexDirection: "column",
        marginTop: 25,
    },
    iconTextButton: {
        paddingBottom: 40,
    },
});

export default Profile;
