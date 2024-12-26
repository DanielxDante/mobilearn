import React, { useState } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import SignInButton from "@/components/Button";
import InputField from "@/components/InputField";
import mobilearnHat from "@/assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore";
import { memberLoginPageConstants as Constants } from "@/constants/textConstants";
import {
    MEMBER_GUEST_HOME,
    ADMIN_HOME,
    MEMBER_SIGNUP_PAGE,
} from "@/constants/pages";
import InputDropDownField from "@/components/InputDropDownField";
import { Colors } from "@/constants/colors";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function LoginPage() {
    const login = useAuthStore((state) => state.loginUser);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [domain, setDomain] = useState("member");

    const handleSignIn = async () => {
        if (email.length === 0 || password.length === 0) {
            alert("Please fill up all fields.");
        } else {
            try {
                const response = await login(email, password);

                if (response === "normal") {
                    router.push(MEMBER_GUEST_HOME);
                } else if (response === "User disabled") {
                    alert(
                        "Your account has been disabled. Please contact the admin."
                    );
                } else if (response === "Invalid credentials") {
                    alert(
                        "Please check your email and password and try again."
                    );
                } else if (response === "admin") {
                    router.push(ADMIN_HOME);
                }
            } catch (error) {
                console.log(error);
                alert("An error occurred while logging in");
            }
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingHorizontal: 16,
                backgroundColor: "white",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    width: "100%",
                    alignItems: "center",
                    //marginBottom: 48,
                    marginTop: -64,
                }}
            >
                {/* Logo at the top */}
                <Image
                    source={mobilearnHat}
                    style={{
                        width: 128,
                        height: 96,
                    }}
                    resizeMode="contain" // Adjust as needed
                />
                <Text
                    style={{
                        fontSize: 36,
                        color: "#356FC5",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 24,
                    }}
                >
                    {Constants.pageTitle}
                </Text>
                <Text
                    style={{
                        color: "#6C6C6C",
                        textAlign: "center",
                        marginBottom: 16,
                        maxWidth: 0.8 * width,
                    }}
                >
                    {Constants.pageSubTitle}
                </Text>
            </View>
            <View style={{ width: "100%" }}>
                <InputField
                    inputTitle={Constants.fields[0].inputTitle}
                    placeholder={Constants.fields[0].placeHolder || ""}
                    value={email}
                    onChangeText={setEmail}
                />
                <InputField
                    inputTitle={Constants.fields[1].inputTitle}
                    placeholder={Constants.fields[1].placeHolder || ""}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                <SignInButton text="Sign In" onPress={handleSignIn} />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 16,
                    }}
                >
                    <Text>Don’t have an Account? </Text>
                    <Link
                        style={{ color: Colors.darkerBlue }}
                        href={{ pathname: MEMBER_SIGNUP_PAGE }}
                    >
                        Sign Up here
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}
