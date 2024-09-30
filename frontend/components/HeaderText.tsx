import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

import { Colors } from "@/constants/colors";

export type HeaderTextProps = {
    text: string;
    style?: TextStyle;
};

const HeaderText = ({ text, style }: HeaderTextProps) => {
    return <Text style={[styles.header, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
    header: {
        color: Colors.defaultBlue,
        fontFamily: "Plus-Jakarta-Sans",
        marginLeft: 35,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: "bold",
    },
});

export default HeaderText;
