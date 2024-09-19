import { router } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

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
        source={require("../../assets/images/SignInUp.png")}
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
        Unlock Your Learning Potential
      </Text>
      <Text
        style={{
          color: "#6c6c6c",
          textAlign: "center",
          marginBottom: 26,
          marginHorizontal: 32,
        }}
      >
        Your Gateway To Personalized Courses, And Guidance For Success.
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          columnGap: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#356FC5",
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#356FC5",
          }}
          onPress={() => {
            router.push("/shared/loginPage");
            console.log("Continue pressed");
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            SIGN IN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "#356FC5",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#356FC5",
              fontWeight: "600",
            }}
          >
            SIGN UP
          </Text>
        </TouchableOpacity>
      </View>

      {/* Temporary button to redirect to homepage*/}
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#356FC5",
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#356FC5",
          }}
          onPress={() => {
            router.push("/(member_guest)/home");
            console.log("Continue pressed");
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            HOMEPAGE
          </Text>
        </TouchableOpacity>
      </View>

      {/* Temporary button to redirect to admin page*/}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#356FC5",
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#356FC5",
          }}
          onPress={() => {
            router.push("/(admin)/home");
            console.log("Admin logged in");
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            ADMIN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpPage;
