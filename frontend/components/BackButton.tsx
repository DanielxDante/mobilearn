import React from 'react';
import { Image, TouchableOpacity, StyleSheet, ImageStyle } from 'react-native';
import { router } from 'expo-router';

import icons from '@/constants/Icons';

interface IBackButton {
    style?: ImageStyle;
}

// INFO: DO NOT USE THIS ON HOME PAGES
const BackButton = ({ style }: IBackButton) => {
    return (
        <TouchableOpacity
            onPress={() => {
                router.back();
            }}
        >
            <Image
                source={icons.backButton}
                style={[styles.backButton, style]}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backButton: {
        height: 20,
        width: 20,
        marginLeft: 20,
        padding: 5,
    },
});

export default BackButton;