import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import React, { useState, memo, useRef, useCallback } from "react";
import { AutocompleteDropdown, IAutocompleteDropdownRef } from "react-native-autocomplete-dropdown";

import { images } from "../../constants";
import { IAutocompleteDropdownContext } from "react-native-autocomplete-dropdown/lib/typescript/src/AutocompleteDropdownContext";

interface courseData {
    id: string;
    title: string;
}

interface SearchBarProps {
    courseListData: courseData[];
}

const Search: React.FC<SearchBarProps> = ({ courseListData }) => {
    const [loading, setLoading] = useState(false);
    const [suggestionsList, setSuggestionsList] = useState<courseData[]>([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);

    const searchRef = useRef<any>(null);

    const getSuggestions = useCallback(async (query:string) => {
        const filtertoken = query.toLowerCase();
        if (typeof query !== 'string' || query.length < 3) {
            setSuggestionsList([])
            return
        }
        setLoading(true)
        const suggestions = courseListData.filter( item => item.title.toLowerCase().includes(filtertoken)).map(item => ({
            id: item.id,
            title: item.title,
        }))
        setSuggestionsList(suggestions)
        setLoading(false)
    }, [])

    const onClearPress = useCallback(() => {
        setSuggestionsList([])
    }, [])

    const onOpenSuggestionsList = useCallback(() => {} , [])

    return (
        <AutocompleteDropdown 
            ref={searchRef}
            controller={(controller: IAutocompleteDropdownRef | null) => {
                dropdownController.current = controller;
            }}
            direction="down"
            dataSet={suggestionsList}
            onChangeText={getSuggestions}
            onSelectItem={item => {
                item && setSelectedItem(item.id)
            }}
            debounce={600}
            suggestionsListMaxHeight={50}
            onClear={onClearPress}
            onOpenSuggestionsList={onOpenSuggestionsList}
            loading={loading}
            useFilter={false}
            textInputProps={{
                placeholder: 'Search',
                autoCorrect: false,
                autoCapitalize: 'none',
            style: {
                borderRadius: 25,
                backgroundColor: '#DFDFDF',
                color: '#000000',
                paddingLeft: 18,
            },
            }}
            rightButtonsContainerStyle={{
                right: 8,
                height: 30,
    
                alignSelf: 'center',
            }}
            inputContainerStyle={{
                backgroundColor: '#DFDFDF',
                borderRadius: 25,
            }}
            suggestionsListContainerStyle={{
                backgroundColor: '#383b42',
            }}
            containerStyle={{ flexGrow: 1, flexShrink: 1 }}
            renderItem={(item, text) => <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>}
            //   ChevronIconComponent={<Feather name="chevron-down" size={20} color="#fff" />}
            //   ClearIconComponent={<Feather name="x-circle" size={18} color="#fff" />}
            inputHeight={50}
            showChevron={false}
            closeOnBlur={false}
            //  showClear={false}
        />
    );
};

    //     <View className="p-2 border-2 border-[#D9D9D9] rounded-2xl flex ">
    //         <View className="flex-row items-center">
    //             <TextInput
    //                 className="h-5 border-1 rounded-md px-4 flex-1"
    //                 placeholder="Search"
    //                 value={searchQuery}
    //                 onChangeText={handleSearch}
    //             />
    //             <TouchableOpacity>
    //                 <Image source={images.search} className="w-7 h-7" />
    //             </TouchableOpacity>
    //         </View>
    //         <Dropdown
    //         style={styles.dropdown}
    //         placeholderStyle={styles.placeholderStyle}
    //         selectedTextStyle={styles.selectedTextStyle}
    //         inputSearchStyle={styles.inputSearchStyle}
    //         renderRightIcon={() => (
    //             <Image source={images.hamburger} style={styles.iconStyle} />
    //         )}
    //         data={filteredData}
    //         search
    //         maxHeight={300}
    //         labelField="title"
    //         valueField="id"
    //         placeholder="Select item"
    //         searchPlaceholder="Search..."
    //         value={selectedId}
    //         onChange={(item) => {
    //             setSelectedId(item.id)
    //         }}
    //         renderItem={(item) => (<TouchableOpacity className="p-5 border-b-2 border-b-slate-200">
    //                         <Text>{item.title}</Text>
    //                         </TouchableOpacity>)}
    //         />
    //     </View>

const styles = StyleSheet.create({
    dropdown: {
        margin: 5,
        height: 55,
        backgroundColor: "white",
        padding: 12,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        color: "#356FC5",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default Search;
