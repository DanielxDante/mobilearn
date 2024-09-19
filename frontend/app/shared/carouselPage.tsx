import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { height, width } = Dimensions.get("window"); // Get the screen width

const slides = [
  {
    id: "1",
    image: require("../../assets/images/slide1.png"), // Use the image you uploaded
    title: "Enter the World of E-Learning",
    subtitle:
      "Begin Your Educational Journey With Access To A Diverse Range Of Courses.",
  },
  {
    id: "2",
    image: require("../../assets/images/slide2.png"),
    title: "Embark on Your Learning Adventure",
    subtitle:
      "Explore interactive lessons, quizzes, and multimedia content to enhance your understanding.",
  },
  {
    id: "3",
    image: require("../../assets/images/slide3.png"),
    title: "Engage with Expert Instructors",
    subtitle: "Connect with knowledgeable tutors for personalized guidance.",
  },
  {
    id: "4",
    image: require("../../assets/images/slide4.png"),
    title: "Personalize Your Learning Path",
    subtitle:
      "Customize your learning with progress tracking, and interactive activities.",
  },
];

export default function OnboardingCarousel() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<any>(null);
  const currentIndexRef = useRef<number>(0);

  useEffect(() => {
    // Automatically move to the next slide every 3 seconds
    timerRef.current = setInterval(() => {
      let nextIndex = (currentSlideIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      currentIndexRef.current = nextIndex;
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timerRef.current); // Clear the timer when unmounted
  }, [currentSlideIndex]);

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlideIndex(newIndex);
  };

  const renderItem = ({ item }: any) => (
    <View style={{ width, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={item.image}
        style={{ width: width * 0.8, height: height * 0.3 }} // Scale image proportionally
      />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#356FC5",
          textAlign: "center",
          marginTop: 20,
          marginHorizontal: 30,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#777",
          textAlign: "center",
          marginTop: 10,
          marginHorizontal: 30,
        }}
      >
        {item.subtitle}
      </Text>
    </View>
  );

  return (
    // this is the main view
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "white",
        width,
        justifyContent: "center",
      }}
    >
      <FlatList
        style={{ height: height * 0.8 }}
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item) => item.id}
      />

      {/* Pagination dots */}
      <View
        style={{
          //height: height * 0.05,
          flexDirection: "row",
          justifyContent: "center",
          marginTop: -60,
          marginBottom: 60,
        }}
      >
        {slides.map((_, index) => (
          <View
            key={index}
            style={{
              height: 8,
              width: 8,
              backgroundColor: index === currentSlideIndex ? "#356FC5" : "#ccc",
              borderRadius: 4,
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>

      {/* Continue and Skip buttons */}
      <View
        style={{
          alignItems: "center",
          marginTop: 40,
          marginVertical: 110,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#356FC5",
            paddingVertical: 10,
            paddingHorizontal: 50,
            borderRadius: 2,
          }}
          onPress={() => {
            router.push("/shared/signinupPage");
            console.log("Continue pressed");
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>CONTINUE</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => {
            router.push("/shared/loginPage");
            console.log("Skip pressed");
          }}
        >
          <Text
            style={{
              color: "#777",
              fontSize: 14,
              textDecorationLine: "underline",
            }}
          >
            SKIP
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
