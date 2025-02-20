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
    KeyboardAvoidingView
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView as RNScrollView } from "react-native";
import io, { Socket } from 'socket.io-client';

import { chatChannel as Constants } from "@/constants/textConstants";
import { formatTime } from "@/components/DateFormatter";
import useAppStore from "@/store/appStore";
import { BACKEND_BASE_URL } from "@/constants/routes";
import Message from "@/types/shared/Message";


const MsgBubble: React.FC<Message> = ({ message, incoming, date }) => {
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
const PrivateChatChannel = () => {
    const { chat_id } = useLocalSearchParams<{
            chat_id: string,
        }>();
    const getChatDetails = useAppStore((state) => state.getChatDetails)
    const [name, setName] = useState("");
    const [profilePicture, setProfilePicture] = useState(Constants.default_profile_picture);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");

    const scrollViewRef = useRef<RNScrollView | null>(null);

    useEffect(() => {
        const fetchChatInfo = async () => {
            const chat_info = await getChatDetails("user", Number(chat_id));
            setName(chat_info.chat_name)
            if (chat_info.chat_picture_url) {
                setProfilePicture({uri: chat_info.chat_picture_url})
            }
        }
        
        fetchChatInfo();
        const socketInstance = io(BACKEND_BASE_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            // Enable if you need to bypass SSL verification (development only)
            // rejectUnauthorized: false
        });
        setSocket(socketInstance)

        // Connect event handler
        socketInstance.on('connect', () => {
            console.log('Connected to server');
            socketInstance.emit('client_connected', {message: 'Device is connected'});
        });

        //Handle custom events from server
        socketInstance.on('server_response', (data) => {
            setMessages((prevMessages) => [...prevMessages, data])
        })

        socketInstance.on('server_acknowledgment', (data) => {
            console.log('Server acknowledgment:', data);
        });

        return () => {
            socketInstance.disconnect();
        };

    }, [])

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 1);
    }, []);

    const openChatDetails = () => {
        if (chat_id) {
            router.push({
                pathname: "/(member_guest)/chat/privateChatDetails",
                params: {chat_id: chat_id}
            })
        }
    }

    const sendMessage = () => {
        if (message.trim() && socket) {
            // Add message to UI first before emitting
            const newMessage: Message = { message: message, incoming: false, date: new Date().toString()}
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit('message', { message });
            setMessage('');
        }
    }

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
                <TouchableOpacity onPress={openChatDetails} style={styles.chatChannelHeader}>
                    <Image source={profilePicture} style={styles.profilePicture} />
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                </TouchableOpacity>
            </View>
            {/* Chat */}
            <KeyboardAvoidingView style={styles.chatBody} behavior="padding">
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
                        {
                            messages.map((message, index) => (
                                <MsgBubble
                                    message={message.message}
                                    incoming={message.incoming}
                                    date={message.date}
                                />
                            ))
                        }
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
                            value={message}
                            onChangeText={setMessage}
                            editable
                            multiline
                        />
                    </View>
                    <View style={styles.sendMsgButtonContainer}>
                        <TouchableOpacity onPress={sendMessage}>
                            <Image
                                source={require("@/assets/images/icons/sendMsgButton.png")}
                                style={styles.sendMsgButton}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
    chatChannelHeader: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
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
        flex: 1,
        marginRight: 10,
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

export default PrivateChatChannel;
