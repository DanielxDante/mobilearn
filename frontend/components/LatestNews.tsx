import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { instructorNewsConstants as textConstants } from "@/constants/textConstants";

//Create api to fetch latest news
const LatestNews = ({
  news,
}: {
  news: {
    title: string;
    category: string;
    text?: string;
  }[];
}) => {
  return (
    <View style={styles.latestNewsContainer}>
      <View style={styles.newsHeader}>
        <Text style={styles.newsTitle}>{textConstants.pageTitle}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>{textConstants.seeAll}</Text>
        </TouchableOpacity>
      </View>
      {news.map((item, index) => (
        <TouchableOpacity key={index} style={styles.newsItem}>
          <Text style={styles.newsCategory}>{item.category}</Text>
          <Text style={styles.newsHeadline}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  latestNewsContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.defaultBlue,
  },
  seeAllText: {
    color: "#6C6C6C",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  newsItem: {
    marginBottom: 15,
  },
  newsCategory: {
    fontSize: 12,
    color: "#6C6C6C",
  },
  newsHeadline: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default LatestNews;
