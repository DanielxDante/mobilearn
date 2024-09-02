import React from "react";
import { Text, View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="">
      <ScrollView contentContainerStyle={{ height: '100%', }}>
        <View className="w-full flex justify-center items-center h-full px-4">
          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              Welcome to MobiLearn
            </Text>
            <Link href="/signin">Go To Signin</Link>
            <Link href="/home">Go To Home</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
