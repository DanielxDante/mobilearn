import { View, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import icons from "../../constants/icons";
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
                paddingVertical: focused ? 4 : 0,
                paddingHorizontal: focused ? 8 : 0,
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
                }}
            >
                <Tabs.Screen
                    name="home"
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
                    name="chat"
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
                <Tabs.Screen
                    name="suggestionsSeeAll"
                    options={{
                        title: "SuggestionsSeeAll",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Profile"
                                focused={focused}
                            />
                        ),
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="topCoursesSeeAll"
                    options={{
                        title: "topCoursesSeeAll",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Top Courses"
                                focused={focused}
                            />
                        ),
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="continueWatching"
                    options={{
                        title: "continueWatching",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Continue Watching"
                                focused={focused}
                            />
                        ),
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="suggestionsSection"
                    options={{
                        title: "suggestionsSection",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Suggestions Section"
                                focused={focused}
                            />
                        ),
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="topCourses"
                    options={{
                        title: "topCourses",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Top Courses"
                                focused={focused}
                            />
                        ),
                        href: null,
                    }}
                />
            </Tabs>
            <StatusBar backgroundColor="#161622" style="light" />
        </>
    );
};

export default MemberGuestLayout;
