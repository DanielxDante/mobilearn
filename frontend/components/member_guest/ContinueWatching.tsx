import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";

import { images } from "../../constants";

interface Course {
    id: string;
    title: string;
    school: string;
    rating: string;
    completionRate: number;
    image: any;
}

interface ContinueWatchingProps {
    courseData: Course[];
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ courseData }) => {
    const first2Courses = courseData.slice(0, 2);

    const renderItem = (item: Course) => (
        <TouchableOpacity key={item.id}>
            <View className="border-2 border-slate-100 shadow-2xl rounded-md mt-3 flex flex-row px-2">
                <Image
                    source={item.image}
                    className="w-20 h-20"
                    resizeMode="contain"
                />
                <View className="px-3 flex-1">
                    <Text
                        className="font-interSemiBold text-default-blue text-base"
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                    <Text className="font-interReg text-xs text-default-blue">
                        {item.school}
                    </Text>
                    <View className="flex flex-row items-center">
                        <Image source={images.starRating} className="h-4 w-4" />
                        <Text className="text-[10px] px-1 font-interReg">
                            {item.rating}
                        </Text>
                    </View>
                    <View className="flex-col">
                        <Progress.Bar
                            progress={item.completionRate}
                            color="#356FC5"
                            borderColor="#D9D9D9"
                            unfilledColor="#D9D9D9"
                            width={250}
                        ></Progress.Bar>
                        <View className="flex-row justify-end">
                            <Text className="text-[10px] font-interReg text-slate-500 mr-1">
                                {item.completionRate * 100}% completed
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <Text className="text-lg font-interBold text-default-blue">
                Continue Watching
            </Text>
            {first2Courses.map(renderItem)}
        </View>
    );
};

export default ContinueWatching;
