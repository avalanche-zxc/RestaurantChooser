import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RestaurantsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Restaurants Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});