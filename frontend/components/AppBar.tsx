import { StyleSheet, View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

import Channel from "@/types/shared/Channel";
import { memberGuestAppBarConstants as Constants } from "@/constants/textConstants";
import useAppStore from "@/store/appStore";
import { Colors } from "@/constants/colors";
import { useTranslation } from "react-i18next";

// AppBar used in member_guest homepage

const AppBar = () => {
  const { t } = useTranslation();
  const channels = useAppStore((state) => state.channels);
  const channel_id = useAppStore((state) => state.channel_id);
  const setChannelIdStore = useAppStore((state) => state.setChannelId);

  const [channelSelect, setChannelSelected] = useState(channel_id);
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      renderRightIcon={() => (
        <Image source={Constants.hamburgerIcon} style={styles.iconStyle} />
      )}
      data={channels}
      search
      maxHeight={300}
      labelField="name"
      valueField="id"
      placeholder={
        channels.find((channel) => channel.id === channel_id)?.name ||
        t("memberGuestAppBarConstants.dropDownPlaceholder")
      }
      searchPlaceholder={t("memberGuestAppBarConstants.searchPlaceholder")}
      onChange={(item) => {
        setChannelSelected(item.id);
        setChannelIdStore(item.id);
      }}
      renderItem={(item) => (
        <View style={styles.container}>
          <Text>{item.name}</Text>
        </View>
      )}
      itemContainerStyle={styles.itemContainerStyle}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
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
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: Colors.defaultBlue,
  },
  selectedTextStyle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: Colors.defaultBlue,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  itemContainerStyle: {
    paddingLeft: 5,
    paddingVertical: 3,
  },
});

export default AppBar;
