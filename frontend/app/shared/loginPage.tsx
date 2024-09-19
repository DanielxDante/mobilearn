import React, { useState } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignInButton from "../../components/Button";
import InputField from "../../components/InputField";
import mobilearnHat from "../../assets/images/MobilearnHat.png";
import { useAppStore } from "../../store/appStore"; // Import the store

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAppStore((state) => state.login);

  const handleSignIn = () => {
    console.log("Signing in!");
    login({ email, password }); // Call the login function from the store
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
          SIGN IN
        </Text>
        <Text
          style={{
            color: "#6C6C6C",
            textAlign: "center",
            marginBottom: 16,
            maxWidth: 0.8 * width,
          }}
        >
          Sign In To Access Your Personalized Learning Journey
        </Text>
      </View>
      <View style={{ width: "100%" }}>
        <InputField
          inputTitle="Email"
          placeholder="youremail@gmail.com"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          inputTitle="Password"
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        {/* <Link href="/forgot-password" style={tailwind("text-blue-500 mt-2")}>
            Forgot Password?
          </Link> */}
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
