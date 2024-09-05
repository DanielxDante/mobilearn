import React from "react";
import { Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignInButton from "../../components/Button";
import InputField from "../../components/InputField";
import mobilearnHat from "../../assets/images/MobilearnHat.png";

export default function LoginPage() {
  return (
    <SafeAreaView className={"flex-1 px-4 bg-white"}>
      <View className={"w-full items-center mb-6"}>
        {/* Logo at the top */}
        <Image
          source={mobilearnHat}
          className={"w-32 h-24"} // Adjust the size as needed
          resizeMode="contain" // Adjust as needed
        />
      </View>
      <View className={"w-full"}>
        <Text className={"text-3xl text-[#356FC5] font-bold text-center mb-6"}>
          SIGN IN
        </Text>
        <Text className={"text-gray-500 text-center mb-8"}>
          Sign In To Access Your Personalized Learning Journey
        </Text>
        <InputField inputTitle="Email" placeholder="youremail@gmail.com" />
        <InputField
          inputTitle="Password"
          placeholder="Password"
          secureTextEntry={true}
        />
        {/* <Link href="/forgot-password" style={tailwind("text-blue-500 mt-2")}>
            Forgot Password?
          </Link> */}
        <SignInButton
          text="Sign In"
          onPress={() => console.log("Sign In Pressed")}
        />
        <View className={"flex-row justify-center mt-4"}>
          <Text>Don’t have an Account? </Text>
          {/* <Link href="/signup" style={tailwind("text-blue-500")}>
              Sign Up here
            </Link> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
