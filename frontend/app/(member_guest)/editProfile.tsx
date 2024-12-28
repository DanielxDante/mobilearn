import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import useAuthStore from "@/store/authStore";
import BackButton from "@/components/BackButton";
import { memberGuestEditProfilePage as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import EditProfileFields from "@/components/EditProfileFields";

const EditProfile = () => {
    const authStore = useAuthStore((state) => state);
    // console.log(authStore);
    const username = useAuthStore((state) => state.username);
    const email = useAuthStore((state) => state.email);
    const gender = useAuthStore((state) => state.gender);
    const profile_picture_url = useAuthStore(
        (state) => state.profile_picture_url
    );

    const editGender = useAuthStore((state) => state.editGenderUser);
    const editProfilePicture = useAuthStore(
        (state) => state.editProfilePictureUser
    );
    const editName = useAuthStore((state) => state.editNameUser);
    const editEmail = useAuthStore((state) => state.editEmailUser);
    const editPassword = useAuthStore((state) => state.editPasswordUser);

    const [newUsername, setNewUsername] = useState(username);
    const [newEmail, setNewEmail] = useState(email);
    const [newGender, setNewGender] = useState(gender);
    const [newPictureUrl, setNewPictureUrl] = useState(profile_picture_url);

    const profile_picture = newPictureUrl
        ? { uri: newPictureUrl }
        : Constants.default_profile_picture;

    const handleEditName = async (newName: string | undefined) => {
        if (newName === undefined) {
            alert("Username is undefined");
            return;
        }
        if (newName.length == 0) {
            alert("Username is empty");
        } else {
            try {
                const response = await editName(newName);
                alert(response);
                setNewUsername(newName);
            } catch (error) {
                console.log(error);
                alert("Username has not been changed");
            }
        }
    };
    const handleEditEmail = async (newEmail: string | undefined) => {
        if (newEmail === undefined) {
            alert("Username is undefined");
            return;
        }
        if (newEmail.length == 0) {
            alert("Email is empty");
        } else {
            try {
                const response = await editEmail(newEmail);
                setNewEmail(newEmail);
            } catch (error) {
                console.log(error);
                alert("Email has not been changed");
            }
        }
    };
    const handleEditGender = async (newGender: string | undefined) => {
        if (newGender === undefined) {
            alert("Gender is undefined");
            return;
        }
        if (newGender.length == 0) {
            alert("Gender is empty");
        } else {
            try {
                const response = await editGender(newGender);
                setNewGender(newGender);
            } catch (error) {
                console.log(error);
                alert("Gender has not been changed");
            }
        }
    };
    const handleEditPassword = async (
        oldPassword: string | undefined,
        newPassword: string | undefined
    ) => {
        if (oldPassword === undefined || newPassword === undefined) {
            alert("Passwords are undefined");
            return;
        }
        if (newPassword.length == 0) {
            alert("Password is empty");
        } else {
            try {
                const response = await editPassword(oldPassword, newPassword);
            } catch (error) {
                console.log(error);
                alert("Password has not been changed");
            }
        }
    };
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
            } else {
                if (result.assets[0] != undefined) {
                    // console.log(
                    //     "Calling convertUriToBlob with URI: ",
                    //     result.assets[0].uri
                    // );
                    const uri = result.assets[0].uri;
                    const file = await convertUriToBlob(uri);
                    if (file === null) {
                        console.error("No file selected to upload.");
                        return;
                    }
                    const formData = new FormData();
                    formData.append("file", file.data);
                    const response = await editProfilePicture(formData);
                    setNewPictureUrl(response);
                } else {
                    alert("File is undefined!");
                }
            }
        } catch (error) {
            console.error("Error in handleEditProfilePicture:", error);
        }
    };

    const convertUriToBlob = async (uri: any) => {
        try {
            console.log("convertUriToBlob called with URI: ", uri);

            // Extract file extension from URI and construct mime type
            const fileExtension = uri.split(".").pop();
            const mimeType = `image/${fileExtension}`;

            // console.log("File extension: ", fileExtension);
            // console.log("Mime type: ", mimeType);

            // Read the file content as a Base64 string
            const base64String = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (!base64String) {
                console.error(
                    "Failed to read the file as Base64. The Base64 string is empty."
                );
                return null;
            }

            // Create a Uint8Array from the Base64 string
            const binaryData = new Uint8Array(
                atob(base64String)
                    .split("")
                    .map((char) => char.charCodeAt(0))
            );
            // Create file name with extension
            const fileName = `file.${fileExtension}`;
            return {
                uri,
                name: fileName,
                type: mimeType,
                data: base64String, // This is the base64 string to send to your backend
            };
        } catch (error) {
            console.error("Error in convertUriToBlob:", error);
            return null;
        }
    };
    const checkPermissions = async () => {
        try {
            const { status } =
                await ImagePicker.getMediaLibraryPermissionsAsync();
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
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton />
                <Text style={styles.header}>{Constants.appBarTitle}</Text>
            </View>
            {/* Page body */}
            <ScrollView>
                <View style={styles.body}>
                    <View style={styles.upperBody}>
                        {/* Profile picture */}
                        <TouchableOpacity
                            style={styles.profilePictureContainer}
                            onPress={() => {
                                handleEditProfilePicture();
                                checkPermissions();
                            }}
                        >
                            <Image
                                source={profile_picture}
                                style={styles.profilePicture}
                                onError={(error) =>
                                    console.error(
                                        "Error loading image: ",
                                        error.nativeEvent.error
                                    )
                                }
                            />
                            <View style={styles.editProfilePicture}>
                                <Image
                                    source={Constants.editProfilePicture}
                                    style={styles.editProfilePicturePen}
                                />
                            </View>
                        </TouchableOpacity>
                        {/* Edit fields */}
                        <View style={styles.editFields}>
                            <EditProfileFields
                                title={
                                    Constants.fields.find((field) => field.name)
                                        ?.name?.inputTitle ?? "Your username"
                                }
                                initialValue={newUsername}
                                modalDetails={
                                    Constants.fields.find((field) => field.name)
                                        ?.name?.modalDetails ?? "Error"
                                }
                                onSave={handleEditName}
                            />
                            <EditProfileFields
                                title={
                                    Constants.fields.find(
                                        (field) => field.email
                                    )?.email?.inputTitle ?? "Your email"
                                }
                                initialValue={newEmail}
                                modalDetails={
                                    Constants.fields.find(
                                        (field) => field.email
                                    )?.email?.modalDetails ?? "Error"
                                }
                                onSave={handleEditEmail}
                            />
                            <EditProfileFields
                                title={
                                    Constants.fields.find(
                                        (field) => field.gender
                                    )?.gender?.inputTitle ?? "Your gender"
                                }
                                initialValue={newGender}
                                modalDetails={
                                    Constants.fields.find(
                                        (field) => field.gender
                                    )?.gender?.modalDetails ?? "Error"
                                }
                                onSave={handleEditGender}
                            />
                            <EditProfileFields
                                title={
                                    Constants.fields.find(
                                        (field) => field.password
                                    )?.password?.inputTitle ?? "Your password"
                                }
                                modalDetails={
                                    Constants.fields.find(
                                        (field) => field.password
                                    )?.password?.modalDetails ?? "Error"
                                }
                                onSave={handleEditPassword}
                            />
                        </View>
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
        marginTop: 20,
        alignItems: "center",
    },
    header: {
        color: Colors.defaultBlue,
        fontFamily: "Plus-Jakarta-Sans",
        marginLeft: 25,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: "bold",
    },
    body: {
        flex: 1,
        justifyContent: "space-between",
    },
    upperBody: {
        alignItems: "center",
    },
    profilePictureContainer: {
        marginTop: 30,
        position: "relative",
        width: 140,
        borderRadius: 50,
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
    editFields: {
        width: "100%",
        marginTop: 30,
    },
});

export default EditProfile;
