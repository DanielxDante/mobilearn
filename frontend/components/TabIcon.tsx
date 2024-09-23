import React from "react";
import { View, Image } from "react-native";

import { ITabIcon } from "@/types/shared/layout";


const TabIcon = ({ icon, color, name, focused }: ITabIcon) => {
    return (
        <View className="items-center justify-center">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                style={{ width: 20, height: 20 }} // Increase the width and height to make the icon bigger
            />
        </View>
    );
};

export default TabIcon;