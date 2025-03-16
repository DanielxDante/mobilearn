import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import useAppStore from "@/store/appStore";
import useAuthStore from "@/store/authStore";
import { Colors } from "@/constants/colors";
import { groupCreationPage as Constants } from "@/constants/textConstants";
import InputField from "@/components/InputField";
import { useTranslation } from "react-i18next";

const GroupCreationPage = () => {
  const { t } = useTranslation();
  const { data } = useLocalSearchParams();
  const email = useAuthStore((state) => state.email);
  //console.log(data);
  const selectedUsers = typeof data === "string" ? JSON.parse(data) : [];
  const createGroupChat = useAppStore((state) => state.createGroupChat);
  const [groupName, setGroupName] = useState("");
  console.log(selectedUsers);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      alert(t("groupCreationPage.createGroupAlertCheck"));
      return;
    }

    const participantInfo = selectedUsers.map((user: any) => ({
      //id: user.id,
      participant_email: user.email,
      //name: user.name,
      participant_type: user.participant_type,
      //profile_picture_url: user.profilePicture || null,
    }));

    const chatId = await createGroupChat("user", groupName, participantInfo);
    if (chatId) {
      alert(t("groupCreationPage.groupChatCreated"));
      router.push({
        pathname: "../../../chatPage",
        // params: {},
      });
    } else {
      alert(t("groupCreationPage.failedGroupChatCreation"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        <View style={styles.appBarContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={Constants.backButton} style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.title}>{t("groupCreationPage.createGroup")}</Text>
        </View>
        <TouchableOpacity
          style={styles.reviewsButton}
          onPress={() => {
            handleCreateGroup();
          }}
        >
          <Text>{t("groupCreationPage.done")}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputField}>
        <InputField
          inputTitle={t("groupCreationPage.groupNameInputTitle")}
          placeholder={t("groupCreationPage.groupNamePlaceholder")}
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>
      <ScrollView>
        {selectedUsers &&
          selectedUsers.length > 0 &&
          selectedUsers.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              //onPress={() => toggleUserSelection(item)}
            >
              <View style={styles.chatItemContainer}>
                <Image
                  source={
                    item.profilePicture
                      ? { uri: item.profilePicture }
                      : Constants.default_profile_picture
                  }
                  style={styles.profilePicture}
                />
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.emailText}>{item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        {!selectedUsers && (
          <Text>{t("groupCreationPage.noUsersSelected")}</Text>
        )}
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
    justifyContent: "space-between",
  },
  backButton: {
    height: 25,
    width: 25,
    marginLeft: 25,
    marginRight: 15,
    padding: 5,
  },
  nextButton: {
    height: 25,
    width: 25,
    marginLeft: 25,
    marginRight: 15,
    padding: 5,
    transform: [{ rotate: "180deg" }],
  },
  title: {
    fontFamily: "Inter-Regular",
    color: Colors.defaultBlue,
    fontSize: 22,
    marginLeft: 10,
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    marginHorizontal: 10,
  },
  inputField: {
    marginHorizontal: 10,
  },
  userBubble: {
    flexDirection: "row",
    backgroundColor: Colors.defaultBlue,
    padding: 5,
    borderRadius: 15,
    marginRight: 10,
    alignItems: "center",
  },
  userBubbleText: {
    color: "white",
    marginRight: 5,
  },
  removeUser: {
    color: "red",
    fontWeight: "bold",
  },
  chatItemContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: Colors.defaultBlue,
    paddingVertical: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  profilePicture: {
    height: 50,
    width: 50,
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
  emailText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },

  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    padding: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  userName: {
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewsButton: {
    padding: 5,
    backgroundColor: Colors.tabsIconGray,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default GroupCreationPage;
