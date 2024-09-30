import React, { useState } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import RegisterButton from "@/components/Button";
import InputField from "@/components/InputField";
//import mobilearnHat from "../../assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore"; // Import the store
import { signUpPageConstants as Constants } from "@/constants/textConstants";
import { MEMBER_LOGIN_PAGE } from "@/constants/pages";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function LoginPage() {
    const signup = useAuthStore((state) => state.signup);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conPassword, setConPassword] = useState("");

    const handleRegistration = async () => {
        try {
            await signup(name, email, password, "member");
            router.push(MEMBER_LOGIN_PAGE);
        } catch (error) {
            console.log(error);
            alert("An error occurred while signing up");
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
                {/* <Image
          source={mobilearnHat}
          style={{
            width: 128,
            height: 96,
          }}
          resizeMode="contain" // Adjust as needed
        /> */}
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
                    placeholder={Constants.fields[0].placeHolder}
                    value={name}
                    onChangeText={setName}
                />
                <InputField
                    inputTitle={Constants.fields[1].inputTitle}
                    placeholder={Constants.fields[1].placeHolder}
                    value={email}
                    onChangeText={setEmail}
                />
                <InputField
                    inputTitle={Constants.fields[2].inputTitle}
                    placeholder={Constants.fields[2].placeHolder}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                <InputField
                    inputTitle={Constants.fields[3].inputTitle}
                    placeholder={Constants.fields[3].placeHolder}
                    secureTextEntry={true}
                    value={conPassword}
                    onChangeText={setConPassword}
                />
                <RegisterButton
                    text={Constants.regButtonText}
                    onPress={handleRegistration}
                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 16,
                    }}
                >
                    <Text>Don’t have an Account? </Text>
                    {/* <Link href="/signup" style={tailwind("text-blue-500")}>
              Sign Up here
            </Link> */}
                </View>
            </View>
        </SafeAreaView>
    );
}
