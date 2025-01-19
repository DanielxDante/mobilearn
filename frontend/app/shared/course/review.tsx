import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'

import { reviewPageConstants as Constants } from "@/constants/textConstants";
import BackButton from '@/components/BackButton';
import { Colors } from '@/constants/colors';
import Icon from "react-native-vector-icons/FontAwesome"
import useAppStore from '@/store/appStore';

const Review = () => {
    const saveReview = useAppStore((state) => state.saveReview);
    const getReview = useAppStore((state) => state.getReview)

    const { courseId } = useLocalSearchParams();
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("")

    const handleRating = (star: number) => {
        setRating(star);
    }

    useEffect(() => {
        const fetchReview = async () => {
            const data = await getReview(Number(courseId));
            if (data != false) {
                setFeedback(data.review_text);
                setRating(data.rating.valueOf())
            }
        }
        fetchReview();
    }, [courseId])

    const handleSubmit = async () => {
        if (feedback?.length === 0) {
            alert("Please enter your feedback.")
        } else {
            const response = await saveReview(Number(courseId), rating, feedback);
            if (response === true) {
                Alert.alert("Success", "Your review has been submitted.",
                    [
                        {
                            text: "Ok",
                            onPress: () => router.back(),
                        },
                        
                    ], {cancelable: false}
                );
            } else {
                alert("There has been an error.")
            }
        }
        
    }

  return (
    <SafeAreaView style={styles.container}>
        {/* AppBar */}
        <View style={styles.appBarContainer}>
            <BackButton />
        </View>
        {/* Title */}
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{Constants.title}</Text>
        </View>
        {/* Body */}
        <View style={styles.body}>
            {/* Stars Container */}
            <View style={styles.starContainer}>
                {Array.from({ length: 5 }, (_, index) => {
                    const starNumber = index + 1;
                    return (
                        <TouchableOpacity 
                            onPress={() => handleRating(starNumber)} 
                            key={starNumber}
                            style={styles.star}
                        >
                            <Icon 
                                name={"star"} 
                                size={30} 
                                color={starNumber <= rating ? "#FFC000" : "#CCCCCC"} />
                        </TouchableOpacity>
                    )
                })}
            </View>
            {/* Feedback Container */}
            <View style={styles.feedbackContainer}>
                <TextInput
                    editable
                    multiline
                    textAlignVertical='top'
                    numberOfLines={3}
                    onChangeText={setFeedback}
                    style={styles.feedbackInput}
                    value={feedback}
                />
            </View>
            <View>
                <TouchableOpacity style={styles.submitContainer} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{Constants.submit}</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    appBarContainer: {
        flexDirection: "row",
        marginVertical: 17,
        alignItems: "center",
        justifyContent: "space-between"
    },
    backButton: {
        height: 25,
        width: 25,
        marginLeft: 25,
        padding: 5,
    },
    titleContainer: {
        paddingVertical: 30,
        alignItems: "center",
    },
    title: {
        fontFamily: "Inter-Regular",
        fontSize: 20,
        color: Colors.defaultBlue
    },
    body: {
        flex: 1,
        alignItems: "center",
    },
    starContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 50,
    },
    star: {
        paddingHorizontal: 15,
    },
    feedbackContainer: {

    },
    feedbackInput: {
        backgroundColor: "#ECECEC",
        height: 200,
        width: width * 0.82,
        marginHorizontal: 30,
        borderWidth: 1,
        padding: 10,
        borderRadius: 6,
    },
    submitContainer: {
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: Colors.defaultBlue,
        marginVertical: 30,
        padding: 10,
    },
    submitButtonText: {
        color: "#FFFFFF",
    }


});

export default Review