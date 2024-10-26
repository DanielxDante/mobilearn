import React, { useState } from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import RegisterButton from "@/components/Button";
import InputField from "@/components/InputField";
import InputDropDownField from "@/components/InputDropDownField";
//import mobilearnHat from "../../assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore"; // Import the store
import { instructorSignUpPageConstants as Constants } from "@/constants/textConstants";
import { INSTRUCTOR_REGISTRATION_SUCCESS } from "@/constants/pages";
import icons from "@/constants/icons"; //here is a backbutton icon here
import LargeButton from "@/components/LargeButton";
import PhoneNumberInputField from "@/components/PhoneNumberInputField";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function signUpPage() {
  const signup = useAuthStore((state) => state.signupInstructor);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [combinedPhoneNumber, setCombinedPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  const [internalPage, setInternalPage] = useState(1); // 1 for first page, 2 for second page

  const handleAreaCodeChange = (areaCode: string) => {
    // Extract only the numeric part from the selected area code (e.g., "+1" from "+1 USA")
    const numericAreaCode = areaCode.split(" ")[0];
    // Split the combined phone number to separate the existing phone number
    const currentPhoneNumber = combinedPhoneNumber.replace(/^\+\d{1,3}\s/, ""); // Remove area code from combined string
    const newCombinedPhoneNumber = `${numericAreaCode} ${currentPhoneNumber}`; // Merge new numeric area code with current phone number
    setCombinedPhoneNumber(newCombinedPhoneNumber);
    console.log(newCombinedPhoneNumber);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    // Keep only the area code part from the existing combined phone number
    const areaCode = combinedPhoneNumber.split(" ")[0]; // Get the area code part
    const newCombinedPhoneNumber = `${areaCode} ${phoneNumber}`; // Merge area code with new phone number
    setCombinedPhoneNumber(newCombinedPhoneNumber);
    console.log(newCombinedPhoneNumber);
  };

  const handleNextPage = () => {
    setInternalPage(2);
  };

  const handleBack = () => {
    setInternalPage(1);
  };

  const handleRegistration = async () => {
    try {
      await signup(
        name,
        email,
        password,
        gender,
        "instructor",
        company,
        position
      );
      router.push(INSTRUCTOR_REGISTRATION_SUCCESS);
    } catch (error) {
      console.log(error);
      alert("An error occurred while logging in");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "white",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          //marginBottom: 48,
          marginTop: -64,
        }}
      >
        {internalPage === 2 && (
          <TouchableOpacity
            onPress={handleBack}
            style={{ marginBottom: 32, alignSelf: "flex-start" }}
          >
            <Image
              source={icons.backButton}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        )}
        {internalPage === 1 && (
          <>
            <Text
              style={{
                fontSize: 36,
                color: "#356FC5",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {Constants.pageTitle}
            </Text>
            <Text
              style={{
                color: "#6C6C6C",
                textAlign: "center",
                marginBottom: 16,
                maxWidth: 0.8 * width,
              }}
            >
              {Constants.pageSubTitle}
            </Text>
          </>
        )}
      </View>
      {/* Internal first page */}
      {internalPage === 1 && (
        <View style={{ width: "100%" }}>
          <InputField
            inputTitle={Constants.fields[0].inputTitle}
            placeholder={Constants.fields[0].placeHolder ?? ""}
            value={name}
            onChangeText={setName}
          />
          <InputField
            inputTitle={Constants.fields[1].inputTitle}
            placeholder={Constants.fields[1].placeHolder ?? ""}
            value={email}
            onChangeText={setEmail}
          />
          <InputDropDownField
            inputTitle={Constants.fields[2].inputTitle}
            options={Constants.fields[2].options ?? []}
            value={gender}
            onChange={setGender}
          />
          <PhoneNumberInputField
            areaCodes={Constants.areaCodes}
            phoneNumber={
              combinedPhoneNumber.split(" ").slice(1).join(" ") || ""
            } // Extract phone number
            onPhoneNumberChange={handlePhoneNumberChange}
            onAreaCodeChange={handleAreaCodeChange}
            selectedAreaCode={combinedPhoneNumber.split(" ")[0] || "+1"} // Extract area code
          />
          <RegisterButton text="Next" onPress={handleNextPage} />
        </View>
      )}
      {/* Internal Second Page */}
      {internalPage === 2 && (
        <View style={{ width: "100%" }}>
          <InputField
            inputTitle={Constants.fields[4].inputTitle}
            placeholder={Constants.fields[4].placeHolder ?? ""}
            value={company}
            onChangeText={setCompany}
          />
          <InputField
            inputTitle={Constants.fields[5].inputTitle}
            placeholder={Constants.fields[5].placeHolder ?? ""}
            value={position}
            onChangeText={setPosition}
          />
          <InputField
            inputTitle={Constants.fields[6].inputTitle}
            placeholder={Constants.fields[6].placeHolder ?? ""}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <InputField
            inputTitle={Constants.fields[7].inputTitle}
            placeholder={Constants.fields[7].placeHolder ?? ""}
            secureTextEntry={true}
            value={conPassword}
            onChangeText={setConPassword}
          />
          <RegisterButton
            text={Constants.regButtonText}
            onPress={handleRegistration}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
            }}
          ></View>
        </View>
      )}
    </SafeAreaView>
  );
}
