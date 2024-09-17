import { router } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const SignUpPage = () => {
    return (
        <View className="flex-1 items-center bg-white p-4">
            <Image
                source={require("../../assets/images/SignInUp.png")} // Replace with your actual image path
                className={"w-64 h-72 mt-8 mb-10"} // Adjust the size as needed
                resizeMode="contain" // Adjust as needed
            />

            <Text className="text-2xl font-bold text-center mb-4 mx-8 px-10 text-[#356FC5]">
                Unlock Your Learning Potential
            </Text>
            <Text className="text-gray-500 text-center mb-16 mx-8">
                Your Gateway To Personalized Courses, And Guidance For Success.
            </Text>

            <View className="flex flex-row space-x-4">
                <TouchableOpacity
                    className="bg-[#356FC5] py-2 px-6 rounded-lg items-center border-2 border-[#356FC5]"
                    onPress={() => {
                        router.push("/shared/loginPage");
                        console.log("Continue pressed");
                    }}
                >
                    <Text className="text-white font-semibold">SIGN IN</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white py-2 px-6 rounded-lg border-2 border-[#356FC5] items-center">
                    <Text className="text-[#356FC5] font-semibold">
                        SIGN UP
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Temporary button to redirect to homepage*/}
            <View className="flex flex-row space-x-4 mt-4">
                <TouchableOpacity
                    className="bg-[#356FC5] py-2 px-6 rounded-lg items-center border-2 border-[#356FC5]"
                    onPress={() => {
                        router.push("/(member_guest)/home");
                        console.log("Continue pressed");
                    }}
                >
                    <Text className="text-white font-semibold">HOMEPAGE</Text>
                </TouchableOpacity>
            </View>

            {/* Temporary button to redirect to admin page*/}
            <View className="flex flex-row space-x-4 mt-4">
                <TouchableOpacity
                    className="bg-[#356FC5] py-2 px-6 rounded-lg items-center border-2 border-[#356FC5]"
                    onPress={() => {
                        router.push("/(admin)/home");
                        console.log("Admin logged in");
                    }}
                >
                    <Text className="text-white font-semibold">ADMIN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignUpPage;
