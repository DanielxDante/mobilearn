import { View, Text, StyleSheet } from "react-native";
import React, { useState, useRef, useCallback } from "react";

import {
    AutocompleteDropdown,
    AutocompleteDropdownItem,
    IAutocompleteDropdownRef,
} from "react-native-autocomplete-dropdown";
import { memberGuestSearchConstants as Constants } from "@/constants/textConstants";
import Course from "@/types/shared/Course";

interface SearchBarProps {
    courseListData: Course[];
}

const Search: React.FC<SearchBarProps> = ({ courseListData }) => {
    const [loading, setLoading] = useState(false);
    const [suggestionsList, setSuggestionsList] = useState<Course[]>([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);

    const searchRef = useRef<any>(null);

    const getSuggestions = useCallback(async (query: string) => {
        const filtertoken = query.toLowerCase();
        if (typeof query !== "string" || query.length < 2) {
            setSuggestionsList([]);
            return;
        }
        setLoading(true);
        const suggestions = courseListData.filter((item) =>
            item.title.toLowerCase().includes(filtertoken)
        );
        setSuggestionsList(suggestions);
        setLoading(false);
    }, []);

    const onClearPress = useCallback(() => {
        setSuggestionsList([]);
    }, []);

    const onOpenSuggestionsList = useCallback(() => {}, []);

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
            ref={searchRef}
            controller={(controller: IAutocompleteDropdownRef | null) => {
                dropdownController.current = controller;
            }}
            direction="down"
            dataSet={suggestionsList}
            onChangeText={getSuggestions}
            onSelectItem={(item) => {
                item && setSelectedItem(item.id);
            }}
            debounce={600}
            suggestionsListMaxHeight={150}
            onClear={onClearPress}
            onOpenSuggestionsList={onOpenSuggestionsList}
            loading={loading}
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
                height: 40,
            }}
            suggestionsListContainerStyle={{
                backgroundColor: "#FFFFFF",
                borderRadius: 15,
                borderWidth: 1,
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
