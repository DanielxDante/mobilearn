import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Dimensions,
    ImageBackground,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { router } from "expo-router";
import { ScrollView as RNScrollView } from "react-native";

import { chatChannel as Constants } from "@/constants/textConstants";
import { formatTime } from "@/components/DateFormatter";

interface MsgProps {
    message: string;
    incoming: boolean; // if incoming==false, then msg is outgoing
    date: Date;
}

const MsgBubble: React.FC<MsgProps> = ({ message, incoming, date }) => {
    return (
        <View
            style={[
                styles.messageBubble,
                incoming ? styles.incoming : styles.outgoing,
            ]}
        >
            <View>
                <Text style={styles.msg}>{message}</Text>
            </View>
            <View style={styles.timestampContainer}>
                <Text style={styles.msgTimestamp}>{formatTime(date)}</Text>
            </View>
        </View>
    );
};
const ChatChannel = () => {
    const name = "Ben Dover";
    const profilePicture = require("@/assets/images/member_guest_images/blank_profile_pic.jpg");

    const scrollViewRef = useRef<RNScrollView | null>(null);
    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 1);
    }, []);

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
                        source={Constants.backButton}
                        style={styles.backButton}
                    />
                </TouchableOpacity>
                <Image source={profilePicture} style={styles.profilePicture} />
                <Text style={styles.name}>{name}</Text>
            </View>
            {/* Chat */}
            <View style={styles.chatBody}>
                <ImageBackground
                    source={require("@/assets/images/WAchatbackgroundEdited.jpg")}
                    style={styles.scrollViewBackground}
                    resizeMode="cover"
                >
                    <View style={styles.overlay} />
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <MsgBubble
                            message="Hello! How are you?"
                            incoming={true}
                            date={new Date(2025, 0, 4, 18, 34, 0, 0)}
                        />
                        <MsgBubble
                            message="I'm great. How is your back?"
                            incoming={false}
                            date={new Date(2025, 0, 4, 18, 35, 0, 0)}
                        />
                        <MsgBubble
                            message="It's hurting real bad. I think I need to get it checked soon by a doctor. Maybe a chiropracter?"
                            incoming={true}
                            date={new Date(2025, 0, 4, 18, 35, 0, 0)}
                        />
                        <MsgBubble
                            message="No worries, I am a licensed doctor, now just proceed to bend over."
                            incoming={false}
                            date={new Date(2025, 0, 4, 18, 35, 0, 0)}
                        />
                        <MsgBubble
                            message="test"
                            incoming={false}
                            date={new Date(2025, 0, 4, 18, 35, 0, 0)}
                        />
                        <MsgBubble
                            message="test"
                            incoming={false}
                            date={new Date(2025, 0, 4, 18, 35, 0, 0)}
                        />
                        <MsgBubble
                            message="test"
                            incoming={false}
                            date={new Date(2025, 0, 4, 18, 35, 0, 0)}
                        />
                        <MsgBubble
                            message="test"
                            incoming={false}
                            date={new Date(2025, 0, 4, 18, 35, 0, 0)}
                        />
                        <MsgBubble
                            message="test"
                            incoming={false}
                            date={new Date(2025, 0, 4, 18, 35, 0, 0)}
                        />
                    </ScrollView>
                </ImageBackground>
                {/* Chat input */}
                <View style={styles.textInputBar}>
                    <View style={styles.uploadIconContainer}>
                        <TouchableOpacity>
                            <Image
                                source={require("@/assets/images/icons/clipIcon.png")}
                                style={styles.uploadIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.msgContainer}>
                        <TextInput
                            placeholder={Constants.msgInputPlaceholder}
                            numberOfLines={4}
                            editable
                            multiline
                        />
                    </View>
                    <View style={styles.sendMsgButtonContainer}>
                        <TouchableOpacity>
                            <Image
                                source={require("@/assets/images/icons/sendMsgButton.png")}
                                style={styles.sendMsgButton}
                            />
                        </TouchableOpacity>
                    </View>
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
        height: 80,
        alignItems: "center",
    },
    backButton: {
        height: 25,
        width: 25,
        marginLeft: 25,
        marginRight: 15,
        padding: 5,
    },
    profilePicture: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    name: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-Regular",
        marginLeft: 15,
        paddingBottom: 2,
        fontSize: 22,
    },
    chatBody: {
        flex: 1,
        position: "relative",
    },
    scrollViewBackground: {
        flex: 1,
        justifyContent: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    scrollView: {
        flex: 1,
        width: "100%",
        marginBottom: 50,
    },
    scrollContent: {
        flexGrow: 1,
        width: "100%",
        padding: 10,
    },
    messageBubble: {
        maxWidth: "75%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderRadius: 15,
        marginBottom: 10,
    },
    incoming: {
        backgroundColor: "#FEFEFE", // Light color for incoming messages
        alignSelf: "flex-start", // Align to the left
    },
    outgoing: {
        backgroundColor: "#90D5FF", // Blue color for outgoing messages
        alignSelf: "flex-end", // Align to the right
    },
    msg: {
        fontSize: 14,
        paddingBottom: 5,
    },
    timestampContainer: {
        alignItems: "flex-end",
    },
    msgTimestamp: {
        fontSize: 11,
    },
    textInputBar: {
        flexDirection: "row",
        backgroundColor: "#F0F0F0",
        position: "absolute",
        height: 60,
        bottom: 0,
        width: "100%",
        alignItems: "center",
        // borderWidth: 1,
        flex: 1,
    },
    uploadIconContainer: {
        paddingLeft: 10,
        // borderWidth: 1,
        margin: 4,
    },
    uploadIcon: {
        height: 30,
        width: 30,
    },
    msgContainer: {
        height: 60,
        marginHorizontal: 10,
        // borderWidth: 1,
        justifyContent: "center",
        flex: 1,
    },
    msgInput: {},
    sendMsgButton: {
        height: 30,
        width: 30,
        // borderWidth: 1,
    },
    sendMsgButtonContainer: {
        paddingRight: 10,
    },
});

export default ChatChannel;
