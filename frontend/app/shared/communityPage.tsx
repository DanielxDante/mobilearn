import { View, StyleSheet, Image, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppStore from "@/store/appStore";
import BackButton from "@/components/BackButton";
import Instructor from "@/types/shared/Course/Instructor";
import { Colors } from "@/constants/colors";
import { communityPage as Constants } from "@/constants/textConstants";
import { useTranslation } from "react-i18next";

const CommunityPage = () => {
  const { communityId, communityName } = useLocalSearchParams<{
    communityId: string;
    communityName: string;
  }>();
  const { t } = useTranslation();
  const getCommunities = useAppStore((state) => state.getCommunities);
  const [communityLogo, setCommunityLogo] = useState<string>();
  const getInstructors = useAppStore((state) => state.getInstructors);
  const [instructorData, setInstructorData] = useState<Instructor[]>();
  useEffect(() => {
    const getCommunity = async () => {
      const communityData = await getCommunities();
      const community = communityData.find(
        (community: any) => community.name === communityName
      );
      if (community) {
        setCommunityLogo(community.community_logo_url);
      }
      const instructors = await getInstructors(communityId);
      setInstructorData(instructors);
    };
    getCommunity();
  }, [communityName]);
  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <BackButton />
      </View>
      <ScrollView>
        <View style={styles.body}>
          {/* Logo + name */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: communityLogo }}
              style={styles.communityLogo}
            />
            <View style={styles.communityNameContainer}>
              <Text style={styles.communityName} numberOfLines={2}>
                {communityName}
              </Text>
            </View>
          </View>
          {/* Instructor List */}
          <View style={styles.instructorsContainer}>
            <Text style={styles.instructorsTitle}>
              {t("communityPage.instructors")}
            </Text>
          </View>
          {instructorData?.map((instructor) => (
            <View
              style={styles.instructorContainer}
              key={instructor.instructor_id}
            >
              <View style={styles.profilePicContainer}>
                {instructor.instructor_profile_picture ? (
                  <Image
                    source={{ uri: instructor.instructor_profile_picture }}
                    style={styles.profilePic}
                  />
                ) : (
                  <Image
                    source={Constants.default_profile_picture}
                    style={styles.profilePic}
                  />
                )}
              </View>
              <View>
                <Text>{instructor.instructor_name}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBarContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  body: {
    paddingHorizontal: 25,
    paddingVertical: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  communityLogo: {
    padding: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FFFFFF",
  },
  communityNameContainer: {
    paddingLeft: 15,
    flex: 1,
  },
  communityName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
  },
  instructorsContainer: {
    paddingTop: 30,
    paddingBottom: 10,
  },
  instructorsTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    color: Colors.defaultBlue,
  },
  instructorContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  profilePicContainer: {
    marginRight: 10,
  },
  profilePic: {
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: Colors.defaultBlue,
    borderRadius: 3,
  },
});
export default CommunityPage;
