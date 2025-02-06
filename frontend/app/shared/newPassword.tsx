import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import {router, useLocalSearchParams} from "expo-router";

import { newPasswordPage as Constants } from "@/constants/textConstants";
import { Colors } from '@/constants/colors';
import useAuthStore from "@/store/authStore";

const newPassword = () => {
    const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
    const resetPassword = useAuthStore((state) => state.resetPasswordUser)
    const { token } = useLocalSearchParams<{ token: string }>();

    const handlePasswordSubmit = async () => {
        if (password.length === 0) {
            alert(Constants.emptyPassword);
        } else if (password != confirmPassword) {
			alert(Constants.differentPassword);
		}
		else {
            const response = await resetPassword(token, password);
			if (response === "Password successfully reset") {
				Alert.alert("Success", "Your password has been changed",
					[
						{
							text: "Ok",
							onPress: () => {
								router.replace("/shared/carouselPage");
							}
						}
					], {cancelable: false}
				)
			} else {
				alert("There has been an error");
			}
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
			{/* Body */}
			<View style={styles.body}>
				<Text style={styles.title}>{Constants.title}</Text>
				{/* Password input */}
				<TextInput 
					secureTextEntry={true}
					autoCapitalize='none' 
					style={styles.inputField}
					onChangeText={setPassword}
					placeholder={Constants.placeholder1}/>
				<TextInput 
				secureTextEntry={true} 
				autoCapitalize='none' 
				style={styles.inputField}
				onChangeText={setConfirmPassword}
				placeholder={Constants.placeholder2}/>
				<TouchableOpacity style={styles.submitButton} onPress={handlePasswordSubmit}>
					<Text style={styles.submitButtonText}>{Constants.submitButton}</Text>
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
		alignItems: "center",
	},
	title: {
        fontFamily: "Inter-SemiBold",
        fontSize: 24,
        color: Colors.defaultBlue,
        paddingTop: 70,
        paddingBottom: 30,
    },
	inputField: {
        borderWidth: 2,
        borderColor: "#356FC5",
        paddingHorizontal: 12,
        fontSize: 14,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        marginBottom: 20,
		width: "100%",
    },
    submitButton: {
        alignItems: "center",
        backgroundColor: Colors.defaultBlue,
        paddingVertical: 12,
        borderRadius: 5,
		paddingHorizontal: 30,
		marginVertical: 30,
    },
    submitButtonText: {
        color: "#FFFFFF"
    }
  });

export default newPassword