import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React from "react";

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

const SuggestionsSection: React.FC<ContinueWatchingProps> = ({
    courseData,
}) => {
    const first3Courses = courseData.slice(0, 3);

    const renderItem = ({ item }: { item: Course }) => (
        <TouchableOpacity className="mx-1 mb-3">
            <Image
                source={item.image}
                className="w-30 h-30"
                resizeMode="contain"
            />
            <View className="mt-2 w-44">
                <Text
                    className="font-interMedium text-default-blue text-base leading-5"
                    numberOfLines={2}
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
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <View className="flex-row">
                <FlatList
                    data={first3Courses}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    ListHeaderComponent={<View className="w-3"></View>}
                    ListFooterComponent={<View className="w-3"></View>}
                />
            </View>
        </View>
    );
};

export default SuggestionsSection;
