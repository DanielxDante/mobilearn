import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBar, Search } from "../../components/member_guest";
import { images } from "../../constants";

const Home = () => {
    // placeholder for channels
    const channelData = [
        { label: "Channel 1", value: "1" },
        { label: "Channel 2", value: "2" },
        { label: "Channel 3", value: "3" },
        { label: "Channel 4", value: "4" },
        { label: "Channel 5", value: "5" },
        { label: "Channel 6", value: "6" },
        { label: "Channel 7", value: "7" },
        { label: "Channel 8", value: "8" },
    ];
    const [searchData, setSearchData] = useState<
        { id: string; title: string }[]
    >([
        { id: "1", title: "First Item" },
        { id: "2", title: "Second Item" },
        { id: "3", title: "Third Item" },
    ]);

    const [filteredData, setFilteredData] = useState(searchData);
    const [query, setQuery] = useState<string>("");
    // Function to handle search results from SearchBar
    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        if (searchQuery) {
            const results = searchData.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(results);
        } else {
            setFilteredData([]);
        }
    };
    return (
        <SafeAreaView className="h-full w-full flex bg-white">
            <View className="flex flex-row">
                {/* App bar for channel selection and dropdown */}
                <View className="flex-1">
                    <AppBar options={channelData} />
                </View>
                {/* Notification bell icon */}
                <TouchableOpacity className="p-3 items-center">
                    <Image source={images.notifbell} className="h-8 w-8" />
                </TouchableOpacity>
            </View>
            {/* Search bar */}
            <View className="m-5">
                <Search onSearch={handleSearch} />
                {query && filteredData.length > 0 && (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity className="p-5 border-b-2 border-b-slate-200">
                                <Text>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Home;
