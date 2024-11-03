import React, { useState } from 'react';
import {Text, StyleSheet, ViewStyle, View, Switch } from 'react-native';

interface IToggleTextButton {
    text: string;
    defaultValue: boolean;
    onToggle: (isEnabled: boolean) => Promise<void>;
    style?: ViewStyle;
}

const ToggleTextButton = ({ text, defaultValue, onToggle, style }: IToggleTextButton) => {
    const [isEnabled, setIsEnabled] = useState(defaultValue);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
   
    return (
    <View style={[styles.container, style]}>
        {/* Text */}
        <Text style={styles.text}>{text}</Text>

        {/* Switch */}
        <Switch
            onValueChange={() => {
                onToggle(!isEnabled);
                toggleSwitch();
            }}
            value={isEnabled}
        />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertically center all items
    paddingLeft: 40,
    paddingRight: 25,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  text: {
    flex: 1, // Makes the text take up all available space
    fontSize: 16,
    color: '#000',
    fontFamily: 'Plus-Jakarta-Sans',
  },
});

export default ToggleTextButton;