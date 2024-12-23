import React, { useState } from "react";
import { View, Text } from "react-native";
import { memberChannelSignUpPage as Constants } from "@/constants/textConstants";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "@/constants/colors";

interface Channel {
    label: string;
    value: string;
}

interface ChannelDropdownProps {
    channelData: Channel[];
    handleSelectChannel: (channelValue: string) => void;
}

const ChannelDropdown: React.FC<ChannelDropdownProps> = ({
    channelData,
    handleSelectChannel,
}) => {
    const [selectedChannel, setSelectedChannel] = useState<string>("");

    const onChange = (item: any) => {
        setSelectedChannel(item.value);
        handleSelectChannel(item.value);
    };
    return (
        <View>
            <Text>{Constants.dropDownTitle}</Text>
            <Dropdown
                style={{
                    height: 50,
                    borderColor: Colors.defaultBlue,
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                data={channelData}
                labelField="label"
                valueField="value"
                onChange={onChange}
                placeholder="Select a Channel"
                renderItem={(item) => (
                    <View style={{ paddingVertical: 10, paddingLeft: 8 }}>
                        <Text>{item.label}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default ChannelDropdown;
