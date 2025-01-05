import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import InputField from "@/components/InputField";
import RegisterButton from "@/components/Button";
import { memberChannelSignUpPage as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import useAppStore from "@/store/appStore";
import { Dropdown } from "react-native-element-dropdown";
import { channelData } from "@/constants/temporaryCourseData";

const memberChannelSignUpPage = () => {
    const channels = useAppStore((state) => state.channels);
    const setChannelIdStore = useAppStore((state) => state.setChannelId);
    const getUserChannels = useAppStore((state) => state.getUserChannels);
    const inviteUser = useAppStore((state) => state.inviteUser);
    const [inviteCode, setInviteCode] = useState("");

    useEffect(() => {
        getUserChannels();
    }, []);

    const handleJoinChannel = async (
        inviteCode?: string,
        channelId?: number
    ) => {
        if (channelId) {
            setChannelIdStore(channelId);
            // console.log(
            //     "Redirecting to homepage with channel_id: " + channelId
            // );
        } else if (inviteCode) {
            // Redirect to homepage with new inviteCode
            // console.log("Invite code: " + inviteCode);
            try {
                const response = await inviteUser(inviteCode);
                if (typeof response === "number") {
                    // console.log(
                    //     "Redirecting to homepage with channel_id: " + response
                    // );
                    setInviteCode("");
                } else if (response === "Channel already joined") {
                    alert("Channel already joined");
                } else {
                    alert("Channel not found.");
                }
            } catch (error: any) {
                console.error(error);
            }
        } else {
            alert("Please select a channel or enter an invite code.");
            return;
        }
        router.push("/(member_guest)/(tabs)");
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                {/* Page Title */}
                <Text style={styles.pageTitle}>{Constants.pageTitle}</Text>
                {/* Select a channel */}
                <View>
                    {channels.length === 0 ? (
                        <View></View>
                    ) : (
                        <View>
                            <Text style={styles.dropdownTitle}>
                                {Constants.dropDownTitle}
                            </Text>
                            <View style={styles.dropdown}>
                                <Dropdown
                                    style={{
                                        height: 50,
                                        borderColor: Colors.defaultBlue,
                                        borderWidth: 2,
                                        borderRadius: 5,
                                    }}
                                    data={channels}
                                    labelField="name"
                                    valueField="id"
                                    onChange={(item) => {
                                        handleJoinChannel(undefined, item.id);
                                    }}
                                    placeholder="Select a Channel"
                                    placeholderStyle={{ paddingLeft: 10 }}
                                    selectedTextStyle={{ paddingLeft: 10 }}
                                    renderItem={(item) => (
                                        <View
                                            style={{
                                                paddingVertical: 10,
                                                paddingLeft: 8,
                                            }}
                                        >
                                            <Text>{item.name}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    )}
                </View>
                {/* Input invite code */}
                {channels.length === 0 ? (
                    <InputField
                        inputTitle={Constants.inviteCodeTitle1}
                        placeholder={Constants.inviteCodePlaceholder}
                        value={inviteCode}
                        onChangeText={setInviteCode}
                    />
                ) : (
                    <InputField
                        inputTitle={Constants.inviteCodeTitle2}
                        placeholder={Constants.inviteCodePlaceholder}
                        value={inviteCode}
                        onChangeText={setInviteCode}
                    />
                )}
                <RegisterButton
                    text="Join Channel"
                    onPress={() => {
                        handleJoinChannel(inviteCode, undefined);
                    }}
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
    dropdownTitle: {
        fontSize: 18,
        color: Colors.defaultBlue,
        marginBottom: 8,
    },
    dropdown: {
        paddingBottom: 20,
    },
});
export default memberChannelSignUpPage;
