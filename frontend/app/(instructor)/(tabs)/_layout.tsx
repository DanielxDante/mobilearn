import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ITabIcon } from "@/types/shared/layout";
import { Colors } from "@/constants/colors";
import icons from "../../../constants/icons";

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
                style={{ width: 16, height: 16 }} // Increase the width and height to make the icon bigger
            />
        </View>
    );
};

const InstructorLayout = () => {
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
                        height: "100%",
                    },
                }}
            >
                <Tabs.Screen
                    name="homePage"
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
                    name="profilePage"
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

export default InstructorLayout;
