import { router } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Button from "../../components/MediumButton";
import { SignInUpPageConstants as Constants } from "@/constants/textConstants";
import SignInUp from "../../assets/images/SignInUp.png";

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
                        router.push("/shared/loginPage");
                        console.log("login pressed");
                    }}
                ></Button>
                <Button
                    text={Constants.signUpButtonText}
                    isBlue={false}
                    onPress={() => {
                        router.push("/shared/signupSelection");
                        console.log("signup pressed");
                    }}
                ></Button>
            </View>
            {/* Temporary button to redirect to homepage*/}
            <View
                style={{
                    flexDirection: "row",
                    marginTop: 16,
                }}
            >
                <Button
                    text={Constants.homepageButtonText}
                    isBlue={true}
                    onPress={() => {
                        router.push("/(member_guest)/home");
                        console.log("Homepage pressed");
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
                        router.push("/(admin)");
                        console.log("Admin logged in");
                    }}
                ></Button>
            </View>
        </View>
    );
};

export default SignUpPage;
