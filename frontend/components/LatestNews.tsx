import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

//Create api to fetch latest news
const LatestNews = () => {
  const news = [
    {
      title: "The Effects of Temperature on Enzyme Activity and Biology",
      category: "Biology",
    },
    { title: "Advances in Quantum Computing", category: "Technology" },
    {
      title: "Global Warming and Its Impact on Agriculture",
      category: "Environment",
    },
  ];

  return (
    <View style={styles.latestNewsContainer}>
      <View style={styles.newsHeader}>
        <Text style={styles.newsTitle}>Latest News</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
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
    color: "#4A90E2",
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
