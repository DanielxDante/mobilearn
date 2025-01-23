import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";

import { paymentOverviewConstants as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import BackButton from "@/components/BackButton";
import { router, useLocalSearchParams } from "expo-router";
import Course from "@/types/shared/Course/Course";
import icons from "@/constants/icons";
import useAppStore from "@/store/appStore";
import useAuthStore from "@/store/authStore";
import { sendNotification } from "@/components/notificationUtils";
import { usePushNotifications } from "@/hooks/usePushNotificationState";

const PaymentOverview = () => {
  // CONSTANTS TO BE USED UNTIL COURSE DATA IS FINALISED
  const certicationType = "Online Certification";

  const { expoPushToken, notification } = usePushNotifications();

  const name = useAuthStore((state) => state.username);
  const email = useAuthStore((state) => state.email);
  const courseData = useAppStore((state) => state.selectedCourse);
  const enrollCourse = useAppStore((state) => state.enrollCourse);

  const fetchStripePaymentSheet = useAppStore(
    (state) => state.fetchPaymentSheet
  );
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const handleSkillPress = (skill: string) => {
    console.log(skill);
  };
  const handlePayment = async (
    donationAmount: number,
    default_currency: string
  ) => {
    setLoading(true);
    try {
      const { payment_intent, ephemeral_key, customer_id } =
        await fetchStripePaymentSheet(
          donationAmount.toString(),
          default_currency
        );
      await initPaymentSheet({
        merchantDisplayName: Constants.merchantDisplayName,

        customerId: customer_id,
        customerEphemeralKeySecret: ephemeral_key,
        paymentIntentClientSecret: payment_intent,

        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: name,
          email: email,
        },
        returnURL: Linking.createURL("stripe-redirect"),

        // Enable Apple Pay
        applePay: {
          merchantCountryCode: "SG",
        },
      });
      const { error } = await presentPaymentSheet();
      if (error) {
        Alert.alert(Constants.paymentCancelled);
      } else {
        const response = await enrollCourse(Number(courseId));
        if (response === 200) {
          if (expoPushToken) {
            try {
              await sendNotification(
                expoPushToken.data,
                Constants.courseEnrollmentNotificationTitle,
                Constants.courseEnrollmentNotificationSubTitle
              );
            } catch {
              console.log(error);
            }
          }
          router.push({
            pathname: "./paymentCompleted",
            params: {
              courseId: courseId,
            },
          });
        } else {
          Alert.alert(Constants.error + response, Constants.storeError);
        }
      }
    } catch (error) {
      Alert.alert(Constants.error, Constants.donationError);
    } finally {
      setLoading(false);
    }
  };
  const { courseId } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <BackButton />
      </View>
      <ScrollView>
        {courseData && courseData.course_id.toString() == courseId && (
          <View>
            {/* Title */}
            <View style={styles.titleView}>
              <Text style={styles.title}>{Constants.title}</Text>
            </View>
            {/* Course title */}
            <View style={styles.courseTitleContainer}>
              <Text style={styles.courseTitle}>
                {Constants.courseNameSubtitle}
              </Text>
              <View style={styles.courseNameContainer}>
                <Text
                  style={styles.courseName}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {courseData.course_name}
                </Text>
              </View>
            </View>
            {/* Course Info */}
            <View style={styles.courseInfoContainer}>
              <View style={styles.courseInfo}>
                <Image source={icons.lecture} style={styles.courseInfoIcon} />
                <Text style={styles.courseInfoText}>
                  {"   "}
                  {courseData.lesson_count}
                  {Constants.numLectures}
                </Text>
              </View>
              <View style={styles.courseInfo}>
                <Image source={icons.clock} style={styles.courseInfoIcon} />
                <Text style={styles.courseInfoText}>
                  {"   "}
                  {courseData.duration}
                </Text>
              </View>
              <View style={styles.courseInfo}>
                <Image
                  source={icons.certification}
                  style={styles.courseInfoIcon}
                />
                <Text style={styles.courseInfoText}>
                  {"   "}
                  {certicationType}
                </Text>
              </View>
            </View>
            {/* Skills section */}
            <View style={styles.skillSection}>
              <Text style={styles.skillsTitle}>{Constants.skillsTitle}</Text>
              <View style={styles.skillsContainer}>
                {courseData.skills?.split(", ").map((skill, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.skillButton}
                    onPress={() => handleSkillPress(skill)}
                  >
                    <Text style={styles.skillText}>{skill}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Price section */}
            <View style={styles.priceContainer}>
              <View style={styles.priceContainerLeft}>
                <Image
                  source={Constants.dollarIcon}
                  style={styles.dollarIcon}
                />
                <Text style={styles.totalPrice}>
                  {"  "}
                  {Constants.totalPrice}
                </Text>
              </View>
              {courseData.price === "0.00" ||
              parseFloat(courseData.price) === 0 ? (
                <Text style={styles.totalPrice}>{Constants.free}</Text>
              ) : (
                <Text style={styles.totalPrice}>
                  {courseData.price}
                  {Constants.currency}
                </Text>
              )}
            </View>
            {/* Horizontal line */}
            <View style={styles.horizontalLine}></View>
            {/* Continue Button */}
            {courseData.price === "0.00" ||
            parseFloat(courseData.price) === 0 ? (
              <TouchableOpacity
                style={styles.continueButton}
                onPress={async () => {
                  const response = await enrollCourse(Number(courseId));
                  if (response === 200) {
                    if (expoPushToken) {
                      try {
                        await sendNotification(
                          expoPushToken.data,
                          Constants.courseEnrollmentNotificationTitle,
                          Constants.courseEnrollmentNotificationSubTitle
                        );
                      } catch {
                        console.log(Constants.error);
                      }
                    }
                    router.push({
                      pathname: "./paymentCompleted",
                      params: {
                        courseId: courseId,
                      },
                    });
                  }
                }}
              >
                <Text style={styles.continueText}>
                  {Constants.continueButton}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  const default_currency = "SGD";
                  handlePayment(Number(courseData.price), default_currency);
                }}
              >
                <Text style={styles.continueText}>
                  {Constants.continueButton}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 1,
  },
  appBarContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  titleView: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    color: Colors.defaultBlue,
    fontSize: 22,
  },
  courseTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  courseTitle: {
    marginLeft: 20,
    fontFamily: "Inter-SemiBold",
    color: Colors.defaultBlue,
    fontSize: 15,
  },
  courseNameContainer: {
    flex: 1,
  },
  courseName: {
    fontFamily: "Inter-Regular",
    color: Colors.defaultBlue,
    fontSize: 14,
  },
  courseInfoContainer: {
    marginLeft: 25,
    marginTop: 20,
  },
  courseInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  courseInfoIcon: {
    height: 17,
    width: 17,
    marginRight: 5,
    resizeMode: "contain",
  },
  courseInfoText: {
    fontFamily: "Inter-Regular",
    color: "#6C6C6C",
    fontSize: 13,
  },
  skillSection: {
    marginLeft: 25,
    marginTop: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillsTitle: {
    fontFamily: "Inter-SemiBold",
    color: Colors.defaultBlue,
    fontSize: 15,
    marginBottom: 10,
  },
  skillButton: {
    borderColor: "#DEDEDE",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  skillText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: Colors.defaultBlue,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  priceContainerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dollarIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  totalPrice: {
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: Colors.defaultBlue,
  },
  horizontalLine: {
    borderWidth: 1,
    width: width * 0.9,
    alignSelf: "center",
    borderColor: "#DEDEDE",
  },
  continueButton: {
    height: 50,
    width: width * 0.8,
    backgroundColor: Colors.defaultBlue,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    borderRadius: 8,
  },
  continueText: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#EFEFEF",
  },
});

export default PaymentOverview;
