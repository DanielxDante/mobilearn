import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import useAppStore from "@/store/appStore";
import { privateChatDetails as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";

const PrivateChatDetails = () => {
  const getChatDetails = useAppStore((state) => state.getChatDetails);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    Constants.default_profile_picture
  );
  const { chat_id } = useLocalSearchParams<{
    chat_id: string;
  }>();

  useEffect(() => {
    const fetchChatInfo = async () => {
      const chat_info = await getChatDetails("instructor", Number(chat_id));
      setName(chat_info.chat_name);
      if (chat_info.chat_picture_url) {
        setProfilePicture({ uri: chat_info.chat_picture_url });
      }
      const emailTemp = chat_info.participants.find(
        (participant: any) =>
          participant.participant_name === chat_info.chat_name
      )?.participant_email;
      if (emailTemp) {
        setEmail(emailTemp);
      }
    };

    fetchChatInfo();
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
          <Image source={Constants.backButton} style={styles.backButton} />
        </TouchableOpacity>
      </View>
      {/* Body */}
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={profilePicture}
              style={styles.profilePicture}
              onError={(error) =>
                console.error("Error loading image: ", error.nativeEvent.error)
              }
            />
          </View>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.emailView}>
            <Text>
              {Constants.email}
              {email}
            </Text>
          </View>
        </View>
      </ScrollView>
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
  body: {
    alignItems: "center",
  },
  profilePictureContainer: {
    marginTop: 30,
    position: "relative",
    width: 140,
    borderRadius: 50,
    marginBottom: 30,
  },
  profilePicture: {
    width: 140,
    height: 140,
    backgroundColor: "#D9D9D9",
    shadowColor: "rgba(0, 67, 76, 0.25)",
    shadowOpacity: 1,
    shadowRadius: 5,
    borderRadius: 70,
    marginRight: 15,
  },
  editProfilePicture: {
    width: 30,
    height: 30,
    backgroundColor: "#124A7D",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 5,
    right: 10,
  },
  editProfilePicturePen: {
    width: 15,
    height: 15,
  },
  name: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: Colors.defaultBlue,
  },
  emailView: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default PrivateChatDetails;
