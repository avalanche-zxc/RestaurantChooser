import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DecisionScreenNavigation() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Decision Screen</Text>
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