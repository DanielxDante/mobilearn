import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import useAppStore from '@/store/appStore';
import { privateChatDetails as Constants } from "@/constants/textConstants";
import { Colors } from '@/constants/colors';
import Participant from '@/types/shared/Participant';

const GroupChatDetails = () => {
    const getChatDetails = useAppStore((state) => state.getChatDetails);
    const editGroupChatPicture = useAppStore((state) => state.editGroupChatPicture);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [participants, setParticipants] = useState<Participant[]>();
    const [profilePicture, setProfilePicture] = useState(Constants.default_profile_picture);
    const { chat_id } = useLocalSearchParams<{
                chat_id: string,
            }>();
    const fetchChatInfo = async () => {
        const chat_info = await getChatDetails("user", Number(chat_id));
        setName(chat_info.chat_name);
        if (chat_info.chat_picture_url) {
            setProfilePicture({uri: chat_info.chat_picture_url})
        }
        if (chat_info.participants) {
            setParticipants(chat_info.participants);
        }
    }
    useEffect(() => {
        fetchChatInfo();
    }, [])

    const handleEditProfilePicture = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
                console.log("ImagePicker result: ", result);
        
            if (result.canceled) {
                console.log("Image selection cancelled");
                return;
            }
        
            if (result.assets[0]) {
                const uri = result.assets[0].uri;
        
                const filename = uri.split("/").pop();
                const match = /\.(\w+)$/.exec(filename || "");
                const type = match ? `image/${match[1]}` : "image/jpeg";
        
                const formData = new FormData();
                formData.append("new_picture", {
                uri,
                name: filename ?? "profile.jpg",
                type,
                } as any);

                formData.append("participant_type", "user");
                formData.append("chat_id", String(chat_id));
                console.log("FormData: " + JSON.stringify(formData));
        
                const response = await editGroupChatPicture(formData);
                if (response) {
                    await fetchChatInfo();
                }
            } else {
                alert("File is undefined!");
            }
        } catch (error) {
          console.error("Error in handleEditProfilePicture:", error);
        }
      };
    const checkPermissions = async () => {
        // Method to check if user has permissions to select image from gallery
        try {
            const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                // If permission is not granted, request it
                console.log("Requesting permission");
                await requestPermission();
            } else {
                console.log("Permissions already granted");
            }
            } catch (error) {
                console.error("Error checking permissions:", error);
            }
      };
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
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
                    <Image
                        source={Constants.backButton}
                        style={styles.backButton}
                    />
                </TouchableOpacity>
            </View>
            {/* Body */}
            <ScrollView>
                <View style={styles.body}>
                    <TouchableOpacity 
                    style={styles.profilePictureContainer} 
                    onPress={() => {
                        handleEditProfilePicture();
                        checkPermissions();
                    }}>
                        <Image
                            source={profilePicture}
                            style={styles.profilePicture}
                            onError={(error) =>
                                console.error("Error loading image: ", error.nativeEvent.error)
                            }
                        />
                        <View style={styles.editProfilePicture}>
                            <Image
                                source={Constants.editProfilePicture}
                                style={styles.editProfilePicturePen}
                            />
                            </View>
                    </TouchableOpacity>
                    <Text style={styles.name}>{name}</Text>
                    {
                        participants?.map((person) => (
                            <View style={styles.participantView} key={person.participant_id}>
                                <View style={styles.profilePicContainer}>
                                    {
                                        (person.participant_profile_picture_url) ? (
                                            <Image source={{uri: person.participant_profile_picture_url}} style={styles.profilePic}/>
                                        ) : (
                                            <Image source={Constants.default_profile_picture} style={styles.profilePic}/>
                                        )
                                    }
                                </View>
                                <View>
                                    <Text>{person.participant_name}</Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
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
        marginBottom: 30,
    },
    participantView: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
    },
    profilePicContainer: {
        marginRight: 10,
    },
    profilePic: {
        height: 60,
        width: 60,
        borderWidth: 1,
        borderColor: Colors.defaultBlue,
        borderRadius: 3,
    }
});

export default GroupChatDetails;