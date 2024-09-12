import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React, { useState } from "react";

import { images } from "../../constants";

interface SearchBarProps {
    onSearch: (text: string) => void;
}

const Search: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleChange = (text: string) => {
        setSearchQuery(text);
        onSearch(text);
    };

    return (
        <View className="p-2 border-2 border-slate-300 rounded-2xl flex ">
            <View className="flex-row items-center">
                <TextInput
                    className="h-5 border-1 rounded-md px-4 flex-1"
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={handleChange}
                />
                <TouchableOpacity>
                    <Image source={images.search} className="w-7 h-7" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Search;
