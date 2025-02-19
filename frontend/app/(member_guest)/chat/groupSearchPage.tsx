import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";

import { searchChat as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import useAppStore from "@/store/appStore";

interface ChatItemProps {
  id: number;
  email: string;
  name: string;
  profilePicture: any;
  participant_type: string;
}

const GroupSearchPage = () => {
  const searchParticipants = useAppStore((state) => state.searchParticipants);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<ChatItemProps[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<ChatItemProps[]>([]);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return;
      const results = await searchParticipants("user", query, "1", "10");
      setData(results);
    }, 300),
    []
  );

  const toggleUserSelection = (user: ChatItemProps) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.some((u) => u.id === user.id)) {
        return prevSelected.filter((u) => u.id !== user.id);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={Constants.backButton} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>{Constants.title}</Text>
      </View>
      <Searchbar
        placeholder="Search..."
        onChangeText={(text) => {
          setSearchQuery(text);
          handleSearch(text);
        }}
        value={searchQuery}
        style={styles.searchBar}
      />
      <View style={styles.selectedUsersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedUsers.map((user) => (
            <View key={user.id} style={styles.userBubble}>
              <Text style={styles.userBubbleText}>{user.name}</Text>
              <TouchableOpacity onPress={() => toggleUserSelection(user)}>
                <Text style={styles.removeUser}>x</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <ScrollView>
        {data &&
          data.length > 0 &&
          data.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleUserSelection(item)}
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
  selectedUsersContainer: {
    flexDirection: "row",
    padding: 10,
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
});

export default GroupSearchPage;
