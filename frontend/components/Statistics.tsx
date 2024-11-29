import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

//course data of user will be passed in
//to create functions for sorting and processing data
const Statistics = ({
  stats,
}: {
  stats: {
    label: string;
    value: string;
    description?: string;
    change?: string;
  }[];
}) => {
  return (
    <View style={styles.statisticsContainer}>
      <View style={styles.statisticsHeader}>
        <Text style={styles.statisticsTitle}>Statistics</Text>
        <TouchableOpacity>
          <Text style={styles.dropdown}>Month ▼</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statisticsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            {stat.description && (
              <Text style={styles.statDescription}>{stat.description}</Text>
            )}
            {stat.change && (
              <Text
                style={[
                  styles.statChange,
                  {
                    color: stat.change.startsWith("+") ? "green" : "red",
                  },
                ]}
              >
                {stat.change}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statisticsContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  statisticsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statisticsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  dropdown: {
    fontSize: 14,
    color: "#6C6C6C",
  },
  statisticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#4F4F4F",
  },
  statValue: {
    fontSize: 24,
    //fontWeight: "bold",
    color: "#181818",
  },
  statDescription: {
    fontSize: 10,
    color: "#4F4F4F",
  },
  statChange: {
    fontSize: 10,
    //fontWeight: "bold",
  },
});

export default Statistics;
