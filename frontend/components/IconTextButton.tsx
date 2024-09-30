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

        {/* Forward Icon */}
        <Image
            source={icons.chevronRight}
            style={styles.icon}
        />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 25,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 20,
  },
  text: {
    flex: 1, // Makes the text take up all available space
    fontSize: 16,
    color: '#000',
    fontFamily: 'Plus-Jakarta-Sans',
  },
});

export default IconTextButton;
