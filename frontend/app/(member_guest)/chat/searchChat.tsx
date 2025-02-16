import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Searchbar } from 'react-native-paper';
import debounce from "lodash.debounce";

import { searchChat as Constants } from "@/constants/textConstants";
import { Colors } from '@/constants/colors';
import useAppStore from '@/store/appStore';

interface ChatItemProps {
    id: number;
    email: string;
    name: string;
    profilePicture: any;
    participant_type: string;
}

const ChatItem: React.FC<ChatItemProps> = ({
    id,
    email,
    name,
    profilePicture,
    participant_type,
}) => {
    const imageSource = profilePicture ?
    { uri: profilePicture } : Constants.default_profile_picture;
    const handleOpenChat = (chat_id: number) => {
        router.push({
            pathname: "/(member_guest)/chat/privateChatChannel",
            params: {chat_id: chat_id.toString()}
        });
    };
    return (
        <TouchableOpacity
            style={styles.chatItemContainer}
            onPress={() => handleOpenChat(id)}
        >
            <View style={styles.chatItemContainerLeft}>
                <View>
                    <Image
                        source={imageSource}
                        style={styles.profilePicture}
                    />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{name}</Text>
                    <Text style={styles.emailText}>{email}</Text>
                </View>
            </View>
            <View style={styles.chatItemContainerRight}>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{participant_type.charAt(0).toUpperCase()}{participant_type.slice(1)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const SearchChat = () => {
    const searchParticipants = useAppStore((state) => state.searchParticipants);
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState<ChatItemProps[]>();
    const handleSearch = useCallback(
        debounce(async (query: string) => {
            if (!query.trim()) return;
            const results = await searchParticipants("user", query, "1", "10");
            setData(results);
        }, 300), []
    )

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
                <Text style={styles.title}>{Constants.title}</Text>
            </View>
            {/* Search bar */}
            <Searchbar 
                placeholder='Search...' 
                onChangeText={(text) => {setSearchQuery(text); handleSearch(text);}}
                value={searchQuery}
                style={styles.searchBar}
            />
            {/* Results */}
            <ScrollView>
                {
                    data && data.length > 0 ? (data.map((item) => (
                        <ChatItem
                          key={item.id.toString()} // Ensure `key` is a string
                          id={item.id}
                          email={item.email}
                          name={item.name}
                          profilePicture={item.profilePicture}
                          participant_type={item.participant_type}
                        />
                      ))) : (
                        <View>
                        </View>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

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
    chatItemContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: Colors.defaultBlue,
        paddingVertical: 10,
        marginHorizontal: 10,
        justifyContent: "space-between",
    },
    chatItemContainerLeft: {
        flexDirection: "row",
    },
    chatItemContainerRight: {
        justifyContent: "center",
        paddingRight: 7,
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
    }
})

export default SearchChat