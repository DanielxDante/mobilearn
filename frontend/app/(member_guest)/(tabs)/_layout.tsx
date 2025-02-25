import { View, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import icons from "../../../constants/icons";
import { StatusBar } from "expo-status-bar";
import { ITabIcon } from "@/types/shared/layout";
import { Colors } from "@/constants/colors";

const TabIcon = ({ icon, color, name, focused }: ITabIcon) => {
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? Colors.tabsIconGray : "transparent",
                borderRadius: 4,
                paddingVertical: focused ? 6 : 0,
                paddingHorizontal: focused ? 10 : 0,
            }}
        >
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                style={{ width: 16, height: 16 }}
            />
        </View>
    );
};

const MemberGuestLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: Colors.defaultBlue,
                    tabBarInactiveTintColor: Colors.tabsIconGray,
                    tabBarStyle: {
                        backgroundColor: Colors.defaultBlue,
                        borderTopColor: "transparent",
                        height: 60,
                    },
                    tabBarIconStyle: {
                        margin: 0,
                        height: '100%',
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Home"
                                focused={focused}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="coursePage"
                    options={{
                        title: "CoursePage",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.course}
                                color={color}
                                name="CoursePage"
                                focused={focused}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="chatPage"
                    options={{
                        title: "Chat",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.chat}
                                color={color}
                                name="Chat"
                                focused={focused}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.profile}
                                color={color}
                                name="Profile"
                                focused={focused}
                            />
                        ),
                    }}
                />
            </Tabs>
            <StatusBar backgroundColor="#161622" style="light" />
        </>
    );
};

export default MemberGuestLayout;
