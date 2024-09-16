import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";

import icons from "../../constants/Icons";
import { StatusBar } from "expo-status-bar";

interface TabIconProps {
    icon: any;
    color: string;
    name: string;
    focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center">
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
                    tabBarActiveTintColor: "white",
                    tabBarInactiveTintColor: "gray",
                    tabBarStyle: {
                        backgroundColor: "#356FC5",
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
                    name="course"
                    options={{
                        title: "Course",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Course"
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
                                icon={icons.home}
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
                                icon={icons.home}
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
            </Tabs>
            <StatusBar backgroundColor="#161622" style="light" />
        </>
    );
};

export default MemberGuestLayout;
