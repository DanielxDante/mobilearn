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
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView as RNScrollView } from "react-native";
import { Socket } from "socket.io-client";

import { chatChannel as Constants } from "@/constants/textConstants";
import { formatTime } from "@/components/DateFormatter";
import useAppStore from "@/store/appStore";
import Message from "@/types/shared/Message";
import useAuthStore from "@/store/authStore";

interface MsgBubbleProps {
  message_id?: number;
  chat_participant_id: number;
  content: string;
  timestamp: string;
  self_participant_id: number;
  participant_list: {
    id: number;
    name: string;
  }[];
}
const MsgBubble: React.FC<MsgBubbleProps> = ({
  message_id,
  chat_participant_id,
  content,
  timestamp,
  self_participant_id,
  participant_list,
}) => {
  const otherParticipant = participant_list.find(
    (participant) =>
      participant.id === chat_participant_id &&
      participant.id !== self_participant_id
  );
  const otherParticipantName = otherParticipant
    ? otherParticipant.name
    : undefined;

  return (
    <View
      style={[
        styles.messageBubble,
        chat_participant_id !== self_participant_id
          ? styles.incoming
          : styles.outgoing,
      ]}
    >
      {otherParticipant && (
        <View style={styles.participantNameView}>
          <Text style={styles.participantName}>{otherParticipantName}</Text>
        </View>
      )}
      <View>
        <Text style={styles.msg}>{content}</Text>
      </View>
      <View style={styles.timestampContainer}>
        <Text style={styles.msgTimestamp}>{formatTime(timestamp)}</Text>
      </View>
    </View>
  );
};
const GroupChatChannel = () => {
  const { chat_id } = useLocalSearchParams<{
    chat_id: string;
  }>();
  const getChatDetails = useAppStore((state) => state.getChatDetails);
  const getSocket = useAppStore((state) => state.getSocket);
  const getChatMessages = useAppStore((state) => state.getChatMessages);
  const email = useAuthStore((state) => state.email);
  const [name, setName] = useState(""); //name refers to name of chat
  const [chatParticipantId, setChatParticipantId] = useState(""); //chatParticipantId refers to own instructor's ID
  const [participants, setParticipants] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]); // list of all participants and their IDs
  const [profilePicture, setProfilePicture] = useState(
    Constants.default_profile_picture
  );
  const [socket, setSocket] = useState<Socket | null>();
  const [messages, setMessages] = useState<Message[]>([]); //Refers to list of existing chat messages
  const [message, setMessage] = useState<string>(""); //Refers to instructor's own message to be sent

  const scrollViewRef = useRef<RNScrollView | null>(null);

  useEffect(() => {
    const fetchChatInfo = async () => {
      const chat_info = await getChatDetails("instructor", Number(chat_id));
      // Set Chat name
      setName(chat_info.chat_name);
      // Identify own instructor
      const participant = chat_info.participants.find(
        (person: any) => person.participant_email === email
      );
      // Retrieve existing chat messages
      if (participant) {
        setChatParticipantId(participant.participant_id);
        const messagesResponse = await getChatMessages(
          Number(chat_id),
          participant.participant_id,
          "1"
        );
        console.log(messagesResponse);
        setMessages(messagesResponse);
      }
      const participantList = chat_info.participants.map(
        (participant: any) => ({
          id: participant.participant_id,
          name: participant.participant_name,
        })
      );
      if (participantList) {
        setParticipants(participantList);
      }
      if (chat_info.chat_picture_url) {
        setProfilePicture({ uri: chat_info.chat_picture_url });
      }
    };

    fetchChatInfo();
  }, []);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    if (socketInstance && chatParticipantId) {
      socketInstance.emit("join_chat", {
        chat_id: Number(chat_id),
        chat_participant_id: chatParticipantId,
      });
      socketInstance.on("chat_participant_joined", () => {
        console.log("(Group Chat) instructor has joined the chat");
      });
      socketInstance.on("new_message", (message_data: any) => {
        console.log("(Chat Channel) Received new_message");
        console.log(message_data);
        if (message_data.sender_id.toString() != chatParticipantId) {
          const formattedMessage = {
            chat_participant_id: message_data.sender_id,
            content: message_data.content,
            message_id: message_data.message_id,
            timestamp: message_data.timestamp,
          };
          setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        }
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.emit("leave_chat");
        socketInstance.off("chat_participant_joined");
        socketInstance.off("new_message");
      }
    };
  }, [chatParticipantId]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1);
  }, [messages]);

  const openChatDetails = () => {
    if (chat_id) {
      router.push({
        pathname: "/(instructor)/chat/groupChatDetails",
        params: { chat_id: chat_id },
      });
    }
  };

  const sendMessage = () => {
    if (message.trim() && socket) {
      // Add message to UI first before emitting
      const newMessage: Message = {
        chat_participant_id: Number(chatParticipantId),
        content: message,
        timestamp: new Date().toString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("send_message", {
        chat_id: Number(chat_id),
        chat_participant_id: chatParticipantId,
        content: message.trim(),
      });
      setMessage("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Image source={Constants.backButton} style={styles.backButton} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openChatDetails}
          style={styles.chatChannelHeader}
        >
          <Image source={profilePicture} style={styles.profilePicture} />
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Chat */}
      <View style={styles.chatBody}>
        <ImageBackground
          source={Constants.WAchatBackgroundEdited}
          style={styles.scrollViewBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {messages.map((message, index) => (
              <MsgBubble
                key={index}
                message_id={message.message_id}
                chat_participant_id={message.chat_participant_id}
                content={message.content}
                timestamp={message.timestamp}
                self_participant_id={Number(chatParticipantId)}
                participant_list={participants}
              />
            ))}
          </ScrollView>
        </ImageBackground>
        {/* Chat input */}
        <View style={styles.textInputBar}>
          <View style={styles.uploadIconContainer}>
            <TouchableOpacity>
              <Image source={Constants.clipIcon} style={styles.uploadIcon} />
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
                source={Constants.sendMsgButton}
                style={styles.sendMsgButton}
              />
            </TouchableOpacity>
          </View>
        </View>
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
  participantNameView: {
    marginBottom: 2,
  },
  participantName: {
    color: Colors.defaultBlue,
    fontFamily: "Inter-SemiBold",
  },
});

export default GroupChatChannel;
