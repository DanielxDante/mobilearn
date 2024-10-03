import { StyleSheet, View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { memberGuestAppBarConstants as Constants } from "@/constants/textConstants";

// AppBar used in member_guest homepage

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
            <View style={styles.container}>
                <Text>{item.label}</Text>
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
                <Image
                    source={Constants.hamburgerIcon}
                    style={styles.iconStyle}
                />
            )}
            data={options}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={Constants.dropDownPlaceholder}
            searchPlaceholder={Constants.searchPlaceholder}
            value={value}
            onChange={(item) => {
                setValue(item);
            }}
            renderItem={renderItem}
            itemContainerStyle={styles.itemContainerStyle}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
    },
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
    itemContainerStyle: {
        paddingLeft: 5,
        paddingVertical: 3,
    },
});

export default AppBar;
