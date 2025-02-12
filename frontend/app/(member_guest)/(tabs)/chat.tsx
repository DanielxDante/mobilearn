import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { chat as Constants } from "@/constants/textConstants";
import { router, useSegments } from "expo-router";
import { Colors } from "@/constants/colors";
import { formatTime } from "@/components/DateFormatter";
import useAppStore from "@/store/appStore";
import useAuthStore from "@/store/authStore";

interface ChatItemProps {
    name: string;
    profilePicture: any;
    latestMessage?: string;
    time: Date;
    numUnreadMessages: number;
}

const ChatItem: React.FC<ChatItemProps> = ({
    name,
    profilePicture,
    latestMessage,
    time,
    numUnreadMessages,
}) => {
    return (
        <TouchableOpacity
            style={styles.chatItemContainer}
            onPress={handleOpenChat}
        >
            <View style={styles.leftContainer}>
                <View>
                    <Image
                        source={profilePicture}
                        style={styles.profilePicture}
                    />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{name}</Text>
                    <Text style={styles.latestMessage} numberOfLines={1}>
                        {latestMessage}
                    </Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.numUnreadMessagesContainer}>
                    <Text style={styles.numUnreadMessagesText}>
                        {numUnreadMessages}
                    </Text>
                </View>
                <View>
                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const handleOpenChat = () => {
    router.push("../chat/chatChannel");
};

const Chat = () => {
    const getChats = useAppStore((state) => state.getParticipantChats);
    const company = useAuthStore((state) => state.company); // Used to check if user or instructor
    const [chats, setChats] = useState();

    const segments = useSegments();
    useEffect(() => {
            const fetchChats = async () => {
                try {
                    let chatList
                    if (company) {
                        chatList = await getChats("instructor");
                    } else {
                        chatList = await getChats("user");
                    }
                    if (typeof(chatList) == 'string') {
                        Alert.alert("Error", "Chats cannot be retrieved");
                    } else {
                        if (JSON.stringify(chatList) !== JSON.stringify(chats)) {
                            setChats(chatList);
                        }
                    }
                } catch (error: any) {
                }
                
            }
            const currentRoute = segments[segments.length - 1]
            if (currentRoute === "chat") {
                fetchChats();
            }
        }, [segments]);

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <Text style={styles.appBarTitle}>{Constants.appBarTitle}</Text>
            </View>
            {/* Add chat and search chat */}
            <View style={styles.addChatRow}>
                <TouchableOpacity style={styles.addChatContainer}>
                    <Image
                        source={Constants.addChat}
                        resizeMode="stretch"
                        style={styles.addChatButton}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addChatContainer}>
                    <Image
                        source={Constants.searchChat}
                        resizeMode="stretch"
                        style={styles.addChatButton}
                    />
                </TouchableOpacity>
            </View>
            {/* Chat list */}
            <ScrollView>
                <ChatItem
                    name="Michael"
                    profilePicture={require("@/assets/images/member_guest_images/blank_profile_pic.jpg")}
                    latestMessage="Hello! Good Morning."
                    time={new Date(2025, 0, 4, 12, 0, 0, 0)}
                    numUnreadMessages={3}
                />
                <ChatItem
                    name="Matthew"
                    profilePicture={require("@/assets/images/member_guest_images/blank_profile_pic.jpg")}
                    latestMessage="Hello! Good Morning."
                    time={new Date(2025, 0, 4, 12, 0, 0, 0)}
                    numUnreadMessages={3}
                />
                <ChatItem
                    name="Daniel"
                    profilePicture={require("@/assets/images/member_guest_images/blank_profile_pic.jpg")}
                    latestMessage="Hello! Good Morning."
                    time={new Date(2025, 0, 4, 12, 0, 0, 0)}
                    numUnreadMessages={3}
                />
                <ChatItem
                    name="Mike Oxlong"
                    profilePicture={require("@/assets/images/member_guest_images/blank_profile_pic.jpg")}
                    latestMessage="Hello! Good Morning."
                    time={new Date(2025, 0, 4, 12, 0, 0, 0)}
                    numUnreadMessages={3}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 25,
    },
    appBarContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    appBarTitle: {
        fontFamily: "Inter-Bold",
        color: Colors.defaultBlue,
        fontSize: 22,
    },
    addChatRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginVertical: 10,
        gap: 10,
    },
    addChatContainer: {
        height: 40,
        width: 40,
    },
    addChatButton: {
        height: 40,
        width: 40,
    },
    chatItemContainer: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: Colors.defaultBlue,
        justifyContent: "space-between",
    },
    leftContainer: {
        flexDirection: "row",
    },
    profilePicture: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    nameContainer: {
        marginLeft: 20,
        justifyContent: "center",
    },
    nameText: {
        color: Colors.defaultBlue,
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
    },
    latestMessage: {
        color: "AEAEAE",
    },
    rightContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    numUnreadMessagesContainer: {
        backgroundColor: Colors.defaultBlue,
        maxHeight: 20,
        maxWidth: 20,
        padding: 1,
        aspectRatio: 1,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 3,
    },
    numUnreadMessagesText: {
        color: "#DEDEDE",
        fontSize: 12,
    },
    timeText: {
        fontSize: 12,
    },
});

export default Chat;
