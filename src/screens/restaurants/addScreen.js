import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../../components/customTextInput";
import CustomButton from "../../components/customButton";
import {
  validateAddress,
  validateName,
  validatePhone,
  validateWebsite,
} from "./validators";
import Toast from "react-native-toast-message";

const AddScreen = ({ navigation }) => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    cuisine: "",
    price: "",
    rating: "",
    phone: "",
    address: "",
    website: "",
    delivery: "",
    key: `r_${new Date().getTime()}`,
    errors: {},
  });

  const setField = (field, value) => {
    setRestaurant((prev) => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: null,
      },
    }));
  };

  const restaurantStateHolder = {
    state: restaurant,
    setState: (nextState) => {
      const fields = Object.keys(nextState).filter((key) => key !== "errors");

      if (fields.length === 1) {
        setField(fields[0], nextState[fields[0]]);
        return;
      }

      setRestaurant((prev) => ({
        ...prev,
        ...nextState,
      }));
    },
  };

  const validateAllFields = () => {
    const errors = {
      name: validateName(restaurant.name),
      cuisine: !restaurant.cuisine ? "Cuisine is required" : null,
      price: !restaurant.price ? "Price is required" : null,
      rating: !restaurant.rating ? "Rating is required" : null,
      phone: validatePhone(restaurant.phone),
      address: validateAddress(restaurant.address),
      website: validateWebsite(restaurant.website),
      delivery: !restaurant.delivery ? "Please specify delivery option" : null,
    };

    setRestaurant((prev) => ({
      ...prev,
      errors,
    }));

    return errors;
  };

  const saveRestaurant = async () => {
    const errors = validateAllFields();
    const firstError = Object.values(errors).find((error) => error !== null);

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
      const existingData = await AsyncStorage.getItem("restaurants");
      const restaurants = existingData ? JSON.parse(existingData) : [];
      restaurants.push(restaurant);
      await AsyncStorage.setItem("restaurants", JSON.stringify(restaurants));

      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Restaurant saved successfully",
        visibilityTime: 2000,
      });

      navigation.navigate("RestaurantsList");
    } catch (error) {
      console.error("Failed to save restaurant:", error);

      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error saving restaurant",
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
            label="Name"
            maxLength={50}
            stateHolder={restaurantStateHolder}
            stateFieldName="name"
            error={restaurant.errors.name}
          />

          <Text style={styles.fieldLabel}>Cuisine</Text>
          <View
            style={[
              styles.pickerContainer,
              restaurant.errors.cuisine ? styles.errorBorder : null,
            ]}
          >
            <Picker
              prompt="Cuisine"
              selectedValue={restaurant.cuisine}
              onValueChange={(value) => setField("cuisine", value)}
              style={styles.picker}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="American" value="American" />
              <Picker.Item label="Chinese" value="Chinese" />
              <Picker.Item label="Italian" value="Italian" />
              <Picker.Item label="Mexican" value="Mexican" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          {restaurant.errors.cuisine ? (
            <Text style={styles.errorText}>{restaurant.errors.cuisine}</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Price</Text>
          <View
            style={[
              styles.pickerContainer,
              restaurant.errors.price ? styles.errorBorder : null,
            ]}
          >
            <Picker
              selectedValue={restaurant.price}
              onValueChange={(value) => setField("price", value)}
              style={styles.picker}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>
          {restaurant.errors.price ? (
            <Text style={styles.errorText}>{restaurant.errors.price}</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Rating</Text>
          <View
            style={[
              styles.pickerContainer,
              restaurant.errors.rating ? styles.errorBorder : null,
            ]}
          >
            <Picker
              selectedValue={restaurant.rating}
              onValueChange={(value) => setField("rating", value)}
              style={styles.picker}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>
          {restaurant.errors.rating ? (
            <Text style={styles.errorText}>{restaurant.errors.rating}</Text>
          ) : null}

          <CustomTextInput
            label="Phone"
            maxLength={20}
            stateHolder={restaurantStateHolder}
            stateFieldName="phone"
            error={restaurant.errors.phone}
            keyboardType="phone-pad"
          />

          <CustomTextInput
            label="Address"
            maxLength={50}
            stateHolder={restaurantStateHolder}
            stateFieldName="address"
            error={restaurant.errors.address}
          />

          <CustomTextInput
            label="Website"
            maxLength={50}
            stateHolder={restaurantStateHolder}
            stateFieldName="website"
            error={restaurant.errors.website}
            keyboardType="url"
            autoCapitalize="none"
          />

          <Text style={styles.fieldLabel}>Delivery?</Text>
          <View
            style={[
              styles.pickerContainer,
              restaurant.errors.delivery ? styles.errorBorder : null,
            ]}
          >
            <Picker
              selectedValue={restaurant.delivery}
              onValueChange={(value) => setField("delivery", value)}
              style={styles.picker}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
          {restaurant.errors.delivery ? (
            <Text style={styles.errorText}>{restaurant.errors.delivery}</Text>
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
            onPress={saveRestaurant}
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