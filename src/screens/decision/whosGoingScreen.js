import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import CustomButton from "../../components/customButton";

const WhosGoingScreen = () => {
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigation = useNavigation();

  const loadPeople = useCallback(async () => {
    try {
      const storedPeople = await AsyncStorage.getItem("people");
      const parsedPeople = storedPeople ? JSON.parse(storedPeople) : [];
      setPeople(parsedPeople);
      setSelected(parsedPeople.map(() => false));
    } catch (error) {
      console.error("Failed to load people data:", error);
      Alert.alert("Error", "Failed to load people data.");
    }
  }, []);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Confirm", "Do you want to go back?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: () => navigation.goBack(),
          },
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation])
  );

  const toggleSelection = (index) => {
    const updatedSelected = [...selected];
    updatedSelected[index] = !updatedSelected[index];
    setSelected(updatedSelected);
  };

  const handleNext = () => {
    const selectedParticipants = people
      .map((person, index) =>
        selected[index] ? { ...person, vetoed: "no" } : null
      )
      .filter(Boolean);

    if (selectedParticipants.length === 0) {
      Alert.alert("No participants", "Please select at least one person.");
      return;
    }

    navigation.navigate("PreFiltersScreen", {
      participants: selectedParticipants,
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemTouchable}
      onPress={() => toggleSelection(index)}
      activeOpacity={0.8}
    >
      <Checkbox
        value={selected[index]}
        onValueChange={() => toggleSelection(index)}
        style={styles.checkbox}
      />
      <Text style={styles.itemText}>
        {item.firstName} {item.lastName} ({item.relationship})
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Who's Going?</Text>

      <FlatList
        style={styles.list}
        data={people}
        keyExtractor={(item) => String(item.key)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No people have been added yet.</Text>
        }
      />

      <CustomButton text="Next" onPress={handleNext} width="70%" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
    backgroundColor: "#ffffff",
    ...Platform.select({
      ios: {},
      android: {},
    }),
  },
  headline: {
    fontSize: 30,
    fontWeight: "600",
  },
  list: {
    width: "94%",
    maxHeight: "70%",
  },
  itemTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
    paddingVertical: 6,
  },
  checkbox: {},
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default WhosGoingScreen;