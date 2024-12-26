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

import useAuthStore from "@/store/authStore";
import BackButton from "@/components/BackButton";
import { memberGuestEditProfilePage as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import InputField from "@/components/InputField";

const EditProfile = () => {
    const { username, email, gender } = useAuthStore();

    const [newProfilePicture, setNewProfilePicture] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newGender, setNewGender] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const editGender = useAuthStore((state) => state.editGenderUser);

    // useEffect(() = {
    //     setNewUsername(username);
    //     setNewEmail(email);
    // }, [username, email]);

    const handleSave = () => {
        //     if (newUsername !== username) {
        //         setUsername(newUsername);
        //     }
        //     if (newEmail !== email) {
        //         setEmail(newEmail);
        //     }
        //     console.log("Profile updated: ", {newUsername, newEmail, password})
    };

    const handleEditGender = async () => {
        console.log(newGender);
        try {
            const response = await editGender(newGender);
            if (typeof response == "string") {
                setNewGender(response);
            }
        } catch (error) {
            console.log(error);
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
                        >
                            <Image
                                source={require("@/assets/images/member_guest_images/temporaryImages/gerard.jpg")}
                                style={styles.profilePicture}
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
                            {/* <InputField
                                inputTitle={Constants.fields[0].inputTitle}
                                placeholder={username}
                                value={newUsername}
                                onChangeText={setNewUsername}
                            />
                            <InputField
                                inputTitle={Constants.fields[1].inputTitle}
                                placeholder={email}
                                value={newEmail}
                                onChangeText={setNewEmail}
                            /> */}
                            <InputField
                                inputTitle={Constants.fields[2].inputTitle}
                                placeholder={gender}
                                value={newGender.toLowerCase()}
                                onChangeText={setNewGender}
                            />
                            {/* <InputField
                                inputTitle={Constants.fields[3].inputTitle}
                                placeholder={
                                    Constants.fields[3].placeholder ?? "******"
                                }
                                value={password}
                                onChangeText={setPassword}
                            />
                            <InputField
                                inputTitle={Constants.fields[4].inputTitle}
                                placeholder={
                                    Constants.fields[4].placeholder ?? "******"
                                }
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            /> */}
                        </View>
                    </View>
                    {/* Save button container */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleEditGender}
                            style={styles.saveButton}
                        >
                            <Text style={styles.buttonText}>
                                {Constants.saveChanges}
                            </Text>
                        </TouchableOpacity>
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
        paddingHorizontal: 20,
    },
    buttonContainer: {
        alignItems: "center",
    },
    saveButton: {
        backgroundColor: Colors.defaultBlue,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 20,
    },
    buttonText: {
        color: "#FFFFFF",
        fontFamily: "Inter-Regular",
    },
});

export default EditProfile;
