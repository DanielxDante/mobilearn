import React, { useState } from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import SignInButton from "@/components/Button";
import InputField from "@/components/InputField";
import mobilearnHat from "@/assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore";
import { instructorLoginPageConstants as Constants } from "@/constants/textConstants";
import {
  INSTRUCTOR_SIGNUP_PAGE,
  INSTRUCTOR_HOME,
  INSTRUCTOR_WAITING_PAGE,
} from "@/constants/pages";
import InputDropDownField from "@/components/InputDropDownField";
import { Colors } from "@/constants/colors";

const { height, width } = Dimensions.get("window"); // Get the screen width
export default function LoginPage() {
  const login = useAuthStore((state) => state.loginInstructor);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (email.length === 0 || password.length === 0) {
      alert(Constants.inputsEmptyAlert);
    } else {
      try {
        const response = await login(email.toLowerCase(), password);

        if (response === "active") {
          router.push(INSTRUCTOR_HOME);
        } else if (response === "not_approved") {
          router.push(INSTRUCTOR_WAITING_PAGE);
        } else if (response === "disabled") {
          alert(Constants.accountDisabledAlert);
        } else if (response === "Invalid credentials") {
          alert(Constants.invalidCredentialsAlert);
        }
      } catch (error) {
        console.error(Constants.unexpectedErrorAlert, error);
        alert(Constants.errorSigningUpAlert);
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
        <View
          style={{
            marginTop: -10,
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/shared/resetPasswordPage")}
          >
            <Text
              style={{ color: Colors.defaultBlue, fontFamily: "Inter-Regular" }}
            >
              {Constants.forgotPassword}
            </Text>
          </TouchableOpacity>
        </View>
        <SignInButton
          text={Constants.signInButtonText}
          onPress={handleSignIn}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <Text
            style={{
              paddingRight: 3,
            }}
          >
            {Constants.dontHaveAccountText}
          </Text>
          <Link
            style={{ color: Colors.darkerBlue }}
            href={{ pathname: INSTRUCTOR_SIGNUP_PAGE }}
          >
            {Constants.signUpText}
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
