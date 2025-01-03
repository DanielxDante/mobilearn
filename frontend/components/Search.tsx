import { View, Text, StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";

import {
    AutocompleteDropdown,
    AutocompleteDropdownItem,
    IAutocompleteDropdownRef,
} from "react-native-autocomplete-dropdown";
import { memberGuestSearchConstants as Constants } from "@/constants/textConstants";
import useAppStore from "@/store/appStore";

// SEARCH CURRENTLY USED IN MEMBER_GUEST, MIGHT BE CHANGED IF MORE INFORMATION NEEDED

interface SearchProps {
    handleSelectCourse: (id: number) => void;
}

const Search: React.FC<SearchProps> = ({ handleSelectCourse }) => {
    const searchCourse = useAppStore((state) => state.searchCourse);
    const channel_id = useAppStore((state) => state.channel_id);
    const [query, setQuery] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedSearch = useCallback(
        debounce(async (text: string) => {
            if (text.trim().length === 0) {
                return;
            }
            setIsLoading(true);

            if (typeof channel_id === "number") {
                const searchResults = await searchCourse(channel_id, text);
                if (Array.isArray(searchResults)) {
                    setData(
                        searchResults.map(
                            (course: {
                                id: number;
                                course_name: string;
                                community_name: string;
                            }) => ({
                                id: course.id.toString(),
                                title: course.course_name,
                            })
                        )
                    );
                } else {
                    setData([]);
                }

                setIsLoading(false);
            } else {
                console.log("channel_id is undefined");
            }
        }, 500),
        [channel_id]
    );

    const handleSearch = (text: string) => {
        setQuery(text);
        debouncedSearch(text);
    };

    const onClearPress = useCallback(() => {
        setData([]);
    }, []);

    const renderItem = (item: AutocompleteDropdownItem) => (
        <View
            style={{
                backgroundColor: "white",
                borderRadius: 15,
                borderColor: "#FFFFFF",
            }}
        >
            <Text
                style={{
                    color: "black",
                    padding: 10,
                    paddingLeft: 15,
                }}
            >
                {item.title}
            </Text>
        </View>
    );

    return (
        <AutocompleteDropdown
            direction="down"
            dataSet={data}
            onChangeText={handleSearch}
            onSelectItem={(item) => {
                if (item) {
                    handleSelectCourse(parseInt(item.id));
                }
            }}
            debounce={50}
            suggestionsListMaxHeight={250}
            onClear={onClearPress}
            loading={isLoading}
            useFilter={false}
            textInputProps={{
                placeholder: Constants.inputPlaceholder,
                autoCorrect: false,
                autoCapitalize: "none",
                style: {
                    borderRadius: 25,
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                    paddingLeft: 18,
                },
            }}
            rightButtonsContainerStyle={{
                right: 15,
                alignSelf: "center",
            }}
            inputContainerStyle={{
                backgroundColor: "#FFFFFF",
                borderRadius: 25,
                borderWidth: 1,
                borderColor: "#B1B1B1",
                height: 50,
            }}
            suggestionsListContainerStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#B1B1B1",
                shadowColor: "#000",
                shadowRadius: 3,
            }}
            renderItem={renderItem}
            inputHeight={50}
            showChevron={false}
            closeOnBlur={false}
        />
    );
};

const styles = StyleSheet.create({});

export default Search;
