import React, { useState } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import SignInButton from "@/components/Button";
import InputField from "@/components/InputField";
import mobilearnHat from "@/assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore";
import { memberLoginPageConstants as Constants } from "@/constants/textConstants";
import { MEMBER_GUEST_HOME, ADMIN_HOME } from "@/constants/pages";
import InputDropDownField from "@/components/InputDropDownField";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("member");

  const handleSignIn = async () => {
    const role = domain.toLowerCase() as "member" | "instructor";
    try {
      const newRole = await login(email, password);

      if (newRole === "member") {
        router.push(MEMBER_GUEST_HOME);
      } else if (newRole === "admin") {
        router.push(ADMIN_HOME);
      }
      // TODO: Redirect to instructors home page once done
      // else if (newRole === "instructor") {
      //   router.push(INSTRUCTOR_HOME);
      // }
    } catch (error) {
      console.log(error);
      alert("An error occurred while logging in");
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
        {/* <InputDropDownField
          inputTitle={Constants.fields[2].inputTitle}
          options={Constants.fields[2].options || []}
          value={domain}
          onChange={setDomain}
        /> */}
        <SignInButton text="Sign In" onPress={handleSignIn} />
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
