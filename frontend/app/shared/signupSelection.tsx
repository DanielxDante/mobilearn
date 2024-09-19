import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import MediumButton from "@/components/MediumButton";
import { signUpSelectionConstants as Constants } from "@/constants/TextConstants";

const RoleSelectionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{Constants.pageTitle}</Text>

      <View style={styles.roleContainer}>
        <Image
          source={Constants.roles[0].image}
          style={styles.image}
          resizeMode="contain"
        />
        <MediumButton
          text={Constants.roles[0].buttonText}
          onPress={() => console.log("Instructor selected")}
        ></MediumButton>
      </View>

      <View style={styles.roleContainer}>
        <Image
          source={Constants.roles[1].image}
          style={styles.image}
          resizeMode="contain"
        />
        <MediumButton
          text={Constants.roles[1].buttonText}
          onPress={() => console.log("Student selected")}
        ></MediumButton>
      </View>

      <Text style={styles.message}>{Constants.pageSubTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    rowGap: 32,
  },
  prompt: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#356fc5",
  },
  roleContainer: {
    rowGap: 24,
    marginBottom: 24,
  },
  image: {
    width: 192, // Adjust as needed
    height: 128, // Adjust as needed
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  message: {
    color: "gray",
    textAlign: "center",
    marginTop: 0,
  },
});

export default RoleSelectionScreen;
