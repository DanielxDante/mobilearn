import { StyleSheet, View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

import { images } from "../../constants";

interface Option {
    label: string;
    value: string;
}

interface AppBarProps {
    options: Option[];
}

const AppBar: React.FC<AppBarProps> = ({ options }) => {
    // const options = ["Channel 1", "Profile", "Settings", "Logout"];
    const [value, setValue] = useState(options[0] || null);

    const renderItem = (item: Option) => {
        return (
            <View className="p-3 flex flex-row justify-between align-middle">
                <Text className="flex-1 text-sm">{item.label}</Text>
            </View>
        );
    };
    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            renderRightIcon={() => (
                <Image source={images.hamburger} style={styles.iconStyle} />
            )}
            data={options}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={value}
            onChange={(item) => {
                setValue(item);
            }}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        margin: 5,
        height: 55,
        backgroundColor: "white",
        padding: 12,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        color: "#356FC5",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default AppBar;
