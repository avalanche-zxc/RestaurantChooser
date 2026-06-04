import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import CustomTextInput from "../../components/customTextInput";
import CustomButton from "../../components/customButton";

import {
  validateFirstName,
  validateLastName,
} from "./validators";

const AddScreen = ({ navigation }) => {
  const [person, setPerson] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    key: `p_${new Date().getTime()}`,
    errors: {},
  });

  const setField = (field, value) => {
    setPerson((prev) => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: null,
      },
    }));
  };

  const personStateHolder = {
    state: person,
    setState: (nextState) => {
      const fields = Object.keys(nextState).filter(
        (key) => key !== "errors"
      );

      if (fields.length === 1) {
        setField(fields[0], nextState[fields[0]]);
        return;
      }

      setPerson((prev) => ({
        ...prev,
        ...nextState,
      }));
    },
  };

  const validateAllFields = () => {
    const errors = {
      firstName: validateFirstName(person.firstName),
      lastName: validateLastName(person.lastName),
      relationship: !person.relationship
        ? "Relationship is required"
        : null,
    };

    setPerson((prev) => ({
      ...prev,
      errors,
    }));

    return errors;
  };

  const savePerson = async () => {
    const errors = validateAllFields();

    const firstError = Object.values(errors).find(
      (error) => error !== null
    );

    if (firstError) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Validation Error",
        text2: firstError,
        visibilityTime: 3000,
      });

      return;
    }

    try {
      const existingData = await AsyncStorage.getItem("people");

      const people = existingData
        ? JSON.parse(existingData)
        : [];

      people.push(person);

      await AsyncStorage.setItem(
        "people",
        JSON.stringify(people)
      );

      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Person saved successfully",
        visibilityTime: 2000,
      });

      navigation.navigate("PeopleList");
    } catch (error) {
      console.error("Failed to save person:", error);

      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error saving person",
        text2: "Please try again",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <ScrollView>
      <View style={styles.addScreenInnerContainer}>
        <View style={styles.addScreenFormContainer}>
          <CustomTextInput
            label="First Name"
            maxLength={50}
            stateHolder={personStateHolder}
            stateFieldName="firstName"
            error={person.errors.firstName}
          />

          <CustomTextInput
            label="Last Name"
            maxLength={50}
            stateHolder={personStateHolder}
            stateFieldName="lastName"
            error={person.errors.lastName}
          />

          <Text style={styles.fieldLabel}>Relationship</Text>

          <View
            style={[
              styles.pickerContainer,
              person.errors.relationship
                ? styles.errorBorder
                : null,
            ]}
          >
            <Picker
              selectedValue={person.relationship}
              onValueChange={(value) =>
                setField("relationship", value)
              }
              style={styles.picker}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="Me" value="Me" />
              <Picker.Item label="Family" value="Family" />
              <Picker.Item label="Friend" value="Friend" />
              <Picker.Item label="Coworker" value="Coworker" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {person.errors.relationship ? (
            <Text style={styles.errorText}>
              {person.errors.relationship}
            </Text>
          ) : null}
        </View>

        <View style={styles.addScreenButtonsContainer}>
          <CustomButton
            text="Cancel"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.cancelButton}
          />

          <CustomButton
            text="Save"
            onPress={savePerson}
            buttonStyle={styles.saveButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addScreenInnerContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    width: "100%",
    paddingBottom: 30,
  },
  addScreenFormContainer: {
    width: "96%",
  },
  fieldLabel: {
    marginLeft: 10,
    marginBottom: 4,
    marginTop: 6,
    fontSize: 16,
  },
  pickerContainer: {
    ...Platform.select({
      ios: {
        width: "96%",
        borderRadius: 8,
        borderColor: "#c0c0c0",
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
      android: {
        width: "96%",
        borderRadius: 8,
        borderColor: "#c0c0c0",
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
    }),
  },
  picker: {
    width: "100%",
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginLeft: 10,
    marginBottom: 10,
  },
  addScreenButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "gray",
    width: "44%",
  },
  saveButton: {
    backgroundColor: "green",
    width: "44%",
  },
});

export default AddScreen;