import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';

import { resetPasswordPage as Constants } from "@/constants/textConstants";
import { Colors } from '@/constants/colors';
import useAuthStore from "@/store/authStore";

const ResetPasswordPage = () => {
    const forgetPassword = useAuthStore((state) => state.forgetPasswordUser);
    const [email, setEmail] = useState("");

    const handleEmailSubmit = async () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (email.length === 0 || reg.test(email) === false) {
            alert(Constants.invalidEmail);
        } else {
            const response = await forgetPassword(email.toLowerCase());
            router.push({
                pathname: "/shared/resetPasswordAwait",
                params: {email: email}
            });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Image
                        source={Constants.backButton}
                        style={styles.backButton}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                {/* Title */}
                <Text style={styles.title}>{Constants.title}</Text>
                {/* Subtitle */}
                <Text style={styles.subtitle}>{Constants.subtitle}</Text>
                {/* Email input */}
                <Text style={styles.emailHeader}>{Constants.emailFieldHeader}</Text>
                <TextInput 
                    inputMode='email' 
                    autoCapitalize='none' 
                    style={styles.inputField}
                    onChangeText={setEmail}/>
                <TouchableOpacity style={styles.submitButton} onPress={handleEmailSubmit}>
                    <Text style={styles.submitButtonText}>{Constants.emailButton}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    appBarContainer: {
        flexDirection: "row",
        marginVertical: 20,
        alignItems: "center",
    },
    backButton: {
        height: 25,
        width: 25,
        marginLeft: 25,
        padding: 5,
    },
    body: {
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: "Inter-Regular",
        fontSize: 24,
        color: Colors.defaultBlue,
        paddingTop: 50,
        paddingBottom: 20,
    },
    subtitle: {
        fontFamily: "Inter-Regular",
        color: "#6C6C6C",
        paddingBottom: 20,
    },
    emailHeader: {
        fontFamily: "Inter-Regular",
        color: "#6C6C6C",
        fontSize: 12,
        paddingBottom: 5,
    },
    inputField: {
        borderWidth: 2,
        borderColor: "#356FC5",
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        marginBottom: 20,
    },
    submitButton: {
        alignItems: "center",
        backgroundColor: Colors.defaultBlue,
        paddingVertical: 12,
        borderRadius: 5,
    },
    submitButtonText: {
        color: "#FFFFFF"
    }
})

export default ResetPasswordPage