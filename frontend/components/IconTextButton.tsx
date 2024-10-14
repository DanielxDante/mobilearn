import React from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
} from "react-native";
import { ImageSourcePropType } from "react-native";

import icons from "@/constants/icons";
import { Colors } from "@/constants/colors";

interface IIconTextButton {
    icon: ImageSourcePropType | null;
    text: string;
    onPress: () => void;
    style?: ViewStyle;
}

const IconTextButton = ({ icon, text, onPress, style }: IIconTextButton) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
        {/* Icon from props */}
        {icon && (
          <Image
            source={icon}
            style={styles.icon}
        />
        )}
        
        {/* Text */}
        <Text style={styles.text}>{text}</Text>

            {/* Text */}
            <Text style={styles.text}>{text}</Text>

            {/* Forward Icon */}
            <Image source={icons.chevron} style={styles.iconChevron} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", // Align items horizontally
        alignItems: "center", // Vertically center all items
        paddingLeft: 40,
        paddingRight: 25,
        paddingVertical: 10,
        backgroundColor: "#fff",
    },
    icon: {
        marginRight: 20,
        height: 17,
        width: 17,
    },
    iconChevron: {
        height: 15,
        width: 12,
    },
    text: {
        flex: 1, // Makes the text take up all available space
        fontSize: 15,
        color: Colors.defaultBlue,
        fontFamily: "Inter-SemiBold",
    },
});

export default IconTextButton;
