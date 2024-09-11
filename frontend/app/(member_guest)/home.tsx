import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBar } from "../../components/member_guest";
import { images } from "../../constants";

const Home = () => {
    const data = [
        { label: "Channel 1", value: "1" },
        { label: "Channel 2", value: "2" },
        { label: "Channel 3", value: "3" },
        { label: "Channel 4", value: "4" },
        { label: "Channel 5", value: "5" },
        { label: "Channel 6", value: "6" },
        { label: "Channel 7", value: "7" },
        { label: "Channel 8", value: "8" },
    ];
    return (
        <View className="h-full w-full flex flex-row justify-between bg-white">
            <View className="flex-1">
                <AppBar options={data} />
            </View>
            <TouchableOpacity className="p-3 items-center">
                <Image source={images.notifbell} className="h-9 w-9" />
            </TouchableOpacity>
        </View>
    );
};

export default Home;
