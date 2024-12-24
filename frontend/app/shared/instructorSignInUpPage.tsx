import { router } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Button from "../../components/MediumButton";
import { instructorSignInUpPageConstants as Constants } from "@/constants/textConstants";
import SignInUp from "../../assets/images/SignInUp.png";
import { MEMBER_GUEST_NAMESPACE } from "@/constants/pages";
import { INSTRUCTOR_LOGIN_PAGE } from "@/constants/pages";
import { INSTRUCTOR_SIGNUP_PAGE } from "@/constants/pages";

const SignUpPage = () => {
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: "white",
                padding: 16,
                justifyContent: "center",
            }}
        >
            <Image
                source={SignInUp}
                style={{
                    width: 256,
                    height: 288,
                    marginTop: 32,
                    marginBottom: 40,
                }}
                resizeMode="contain" // Adjust as needed
            />
            <Text
                style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 16,
                    marginHorizontal: 36,
                    color: "#356FC5",
                    //paddingHorizontal: 40,
                }}
            >
                {Constants.signUpPageTitle}
            </Text>
            <Text
                style={{
                    color: "#6c6c6c",
                    textAlign: "center",
                    marginBottom: 26,
                    marginHorizontal: 32,
                }}
            >
                {Constants.signUpPageSubtitle}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    columnGap: 16,
                }}
            >
                <Button
                    text={Constants.signInButtonText}
                    isBlue={true}
                    onPress={() => {
                        router.push(INSTRUCTOR_LOGIN_PAGE);
                        console.log("login pressed");
                    }}
                ></Button>
                <Button
                    text={Constants.signUpButtonText}
                    isBlue={false}
                    onPress={() => {
                        router.push(INSTRUCTOR_SIGNUP_PAGE);
                        console.log("signup pressed");
                    }}
                ></Button>
            </View>
            {/* Temporary button to redirect to admin page*/}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                }}
            >
                <Button
                    text={Constants.adminButtonText}
                    isBlue={false}
                    onPress={() => {
                        // router.push("/(admin)");
                        console.log("Admin logged in");
                    }}
                ></Button>
            </View>
        </View>
    );
};

export default SignUpPage;
