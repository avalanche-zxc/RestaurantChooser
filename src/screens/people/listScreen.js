import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Text,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import CustomButton from "../../components/customButton";

const ListScreen = ({ navigation }) => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const loadPeople = async () => {
      const data = await AsyncStorage.getItem("people");

      if (data) {
        setPeople(JSON.parse(data));
      }
    };

    const unsubscribe = navigation.addListener(
      "focus",
      loadPeople
    );

    return unsubscribe;
  }, [navigation]);

  const deletePerson = async (id) => {
    Alert.alert(
      "Delete Person",
      "Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const updatedPeople =
              people.filter(
                (person) => person.key !== id
              );

            await AsyncStorage.setItem(
              "people",
              JSON.stringify(updatedPeople)
            );

            setPeople(updatedPeople);

            Toast.show({
              type: "error",
              position: "bottom",
              text1: "Person deleted",
              visibilityTime: 2000,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CustomButton
        text="Add Person"
        onPress={() =>
          navigation.navigate("PeopleAdd")
        }
      />

      <FlatList
        data={people}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.personItem}>
            <View>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>

              <Text style={styles.relationship}>
                {item.relationship}
              </Text>
            </View>

            <CustomButton
              text="Delete"
              onPress={() =>
                deletePerson(item.key)
              }
              buttonStyle={styles.deleteButton}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  personItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  name: {
    fontSize: 18,
  },
  relationship: {
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "red",
  },
});

export default ListScreen;