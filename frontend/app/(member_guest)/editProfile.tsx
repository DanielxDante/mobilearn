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
import EditProfileFields from "@/components/EditProfileFields";

const EditProfile = () => {
    const authStore = useAuthStore((state) => state);
    console.log(authStore);
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
    const [newPicture, setNewPicture] = useState(profile_picture_url);

    const profile_picture = profile_picture_url
        ? { uri: profile_picture_url }
        : Constants.default_profile_picture;

    const handleEditName = async (newName: string) => {
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
    const handleEditEmail = async (newEmail: string) => {
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
    const handleEditGender = async (newGender: string) => {
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
    console.log("Page load email: " + email);
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
