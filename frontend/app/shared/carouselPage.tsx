import { router, useSegments } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  BackHandler,
} from "react-native";
import { carouselPageConstants as Constants } from "@/constants/textConstants";
import MediumButton from "@/components/MediumButton";
import { ROLE_SELECTION_PAGE } from "@/constants/pages";
import { CAROUSEL_PAGE } from "@/constants/pages";
import { usePushNotifications } from "@/hooks/usePushNotificationState";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function OnboardingCarousel() {
  const { expoPushToken, notification } = usePushNotifications();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<any>(null);
  const currentIndexRef = useRef<number>(0);
  const slides = Constants.slides;

  useEffect(() => {
    // Automatically move to the next slide every 3 seconds
    timerRef.current = setInterval(() => {
      let nextIndex = (currentSlideIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      currentIndexRef.current = nextIndex;
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timerRef.current); // Clear the timer when unmounted
  }, [currentSlideIndex]);

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlideIndex(newIndex);
  };

  const segments = useSegments();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Get the current route
        const currentRoute = segments[segments.length - 1];
        // If we're on the member home page, go to hardware home
        if (currentRoute === "carouselPage") {
          BackHandler.exitApp(); // Exit the app
          return true;
        }

        return false;
      }
    );
    return () => backHandler.remove();
  }, [segments]);

  const renderItem = ({ item }: any) => (
    <View style={{ width, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={item.image}
        style={{ width: width * 0.8, height: height * 0.3 }} // Scale image proportionally
        resizeMode="contain"
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
        <MediumButton
          text={Constants.contButtonText}
          isBlue={true}
          onPress={() => {
            router.push(ROLE_SELECTION_PAGE);
            // console.log("Continue pressed");
          }}
        ></MediumButton>
      </View>
    </View>
  );
}
