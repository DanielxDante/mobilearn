import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { channelData } from "@/constants/temporaryCourseData";
import { router } from "expo-router";
import InputField from "@/components/InputField";
import RegisterButton from "@/components/Button";
import { memberChannelSignUpPage as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import ChannelDropdown from "@/components/ChannelDropdown";

const memberChannelSignUpPage = () => {
    const [inviteCode, setInviteCode] = useState("");
    const [selectedChannel, setSelectedChannel] = useState("");

    const handleSelectChannel = (channelValue: string) => {
        setSelectedChannel(channelValue);
    };

    useEffect(() => {
        if (selectedChannel) {
            console.log("Selected Channel: " + selectedChannel);
            router.push("/(member_guest)/(tabs)");
        }
    }, [selectedChannel]);

    const handleJoinChannel = () => {
        if (inviteCode) {
            // Redirect to homepage with new inviteCode
            console.log("Invite code: " + inviteCode);
            router.push("/(member_guest)/(tabs)");
        } else {
            alert("Please select a channel or enter an invite code.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                {/* Page Title */}
                <Text style={styles.pageTitle}>{Constants.pageTitle}</Text>
                {/* Select a channel */}
                <ChannelDropdown
                    channelData={channelData}
                    handleSelectChannel={handleSelectChannel}
                />
                {/* Input invite code */}
                <InputField
                    inputTitle={Constants.inviteCodeTitle}
                    placeholder={Constants.inviteCodePlaceholder}
                    value={inviteCode}
                    onChangeText={setInviteCode}
                />
                <RegisterButton
                    text="Join Channel"
                    onPress={handleJoinChannel}
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
    innerContainer: {
        padding: 32,
        flex: 1,
    },
    pageTitle: {
        fontSize: 24,
        color: Colors.defaultBlue,
        fontFamily: "Inter-SemiBold",
        textAlign: "center",
        marginBottom: 32,
    },
    channelInput: {
        height: 50,
        borderColor: Colors.defaultBlue,
        borderWidth: 1,
        marginBottom: 16,
    },
});
export default memberChannelSignUpPage;
