import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import CustomButton from "../../components/customButton";

const ChoiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const participants = route.params?.participants || [];
  const restaurantsFromRoute = route.params?.restaurants || [];
  const filters = route.params?.filters || {};

  const [participantsState, setParticipantsState] = useState(participants);
  const [restaurants, setRestaurants] = useState(restaurantsFromRoute);
  const [chosenRestaurant, setChosenRestaurant] = useState(null);
  const [selectedVisible, setSelectedVisible] = useState(false);
  const [vetoVisible, setVetoVisible] = useState(false);
  const [vetoText, setVetoText] = useState("Veto");
  const [vetoDisabled, setVetoDisabled] = useState(false);

  useEffect(() => {
    const canVeto = participantsState.some(
      (person) => person.vetoed === "no" || !person.vetoed
    );

    setVetoDisabled(!canVeto);
    setVetoText(canVeto ? "Veto" : "No vetoes left");
  }, [participantsState]);

  const getRandomRestaurant = (list) => {
    if (!list || list.length === 0) {
      return null;
    }

    const index = Math.floor(Math.random() * list.length);
    return list[index];
  };

  const selectRandomRestaurant = () => {
    if (restaurants.length === 0) {
      Alert.alert(
        "No restaurants",
        "There are no restaurants left to choose from."
      );
      return;
    }

    const nextRestaurant = getRandomRestaurant(restaurants);
    setChosenRestaurant(nextRestaurant);
    setSelectedVisible(true);
    setVetoVisible(false);
  };

  const handleAccept = () => {
    if (!chosenRestaurant) {
      Alert.alert("No restaurant", "There is no restaurant selected.");
      return;
    }

    navigation.navigate("PostChoiceScreen", {
      participants: participantsState,
      restaurant: chosenRestaurant,
      filters,
    });
  };

  const handleVetoPress = () => {
    const availableVetoers = participantsState.filter(
      (person) => person.vetoed === "no" || !person.vetoed
    );

    if (availableVetoers.length === 0) {
      Alert.alert("No vetoes left", "No participant can veto anymore.");
      return;
    }

    setVetoVisible(true);
    setSelectedVisible(false);
  };

  const handleVetoBy = (person) => {
    const updatedParticipants = participantsState.map((item) =>
      item.key === person.key ? { ...item, vetoed: "yes" } : item
    );

    const updatedRestaurants = restaurants.filter(
      (restaurant) => restaurant && chosenRestaurant && restaurant.key !== chosenRestaurant.key
    );

    setParticipantsState(updatedParticipants);
    setRestaurants(updatedRestaurants);
    setVetoVisible(false);
    setSelectedVisible(false);

    if (updatedRestaurants.length === 0) {
      Alert.alert(
        "Game over",
        "No restaurants left to choose from."
      );
      navigation.goBack();
      return;
    }

    if (updatedRestaurants.length === 1) {
      navigation.replace("PostChoiceScreen", {
        participants: updatedParticipants,
        restaurant: updatedRestaurants[0],
        filters,
      });
      return;
    }

    const nextRestaurant = getRandomRestaurant(updatedRestaurants);
    setChosenRestaurant(nextRestaurant);
    setSelectedVisible(true);
  };

  const renderParticipant = ({ item }) => (
    <View style={styles.choiceScreenListItem}>
      <Text style={styles.choiceScreenListItemName}>
        {item.firstName} {item.lastName} ({item.relationship})
      </Text>
      <Text>Vetoed: {item.vetoed || "no"}</Text>
    </View>
  );

  if (!chosenRestaurant && restaurants.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>Choice</Text>
        <Text>No restaurant selected.</Text>
        <CustomButton
          text="Randomly Choose"
          width="94%"
          onPress={selectRandomRestaurant}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Choice</Text>

      <FlatList
        style={styles.choiceScreenListContainer}
        data={participantsState.filter(Boolean)}
        keyExtractor={(item) => String(item.key)}
        renderItem={renderParticipant}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>
            No participants available.
          </Text>
        }
      />

      <CustomButton
        text="Randomly Choose"
        width="94%"
        onPress={selectRandomRestaurant}
      />

      <Modal
        visible={selectedVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedVisible(false)}
      >
        {chosenRestaurant ? (
          <View style={styles.selectedContainer}>
            <View style={styles.selectedInnerContainer}>
              <Text style={styles.selectedName}>
                {chosenRestaurant.name}
              </Text>

              <View style={styles.selectedDetails}>
                <Text style={styles.selectedDetailsLine}>
                  This is a {"★".repeat(Number(chosenRestaurant.rating) || 0)} star
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  {chosenRestaurant.cuisine} restaurant
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  with a price rating of {"$".repeat(Number(chosenRestaurant.price) || 0)}
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  that {chosenRestaurant.delivery === "Yes" ? "DOES" : "DOES NOT"} deliver
                </Text>
              </View>

              <CustomButton
                text="Accept"
                width="94%"
                onPress={handleAccept}
              />
              <CustomButton
                text={vetoText}
                width="94%"
                onPress={handleVetoPress}
                disabled={vetoDisabled}
              />
            </View>
          </View>
        ) : (
          <View style={styles.selectedContainer}>
            <Text>No restaurant selected.</Text>
          </View>
        )}
      </Modal>

      <Modal
        visible={vetoVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {}}
      >
        <View style={styles.vetoContainer}>
          <View style={styles.vetoContainerInner}>
            <Text style={styles.vetoHeadline}>Who is vetoing?</Text>
            <ScrollView style={styles.vetoScrollViewContainer}>
              {participantsState
                .filter((person) => person.vetoed === "no" || !person.vetoed)
                .map((person) => (
                  <TouchableOpacity
                    key={person.key}
                    style={styles.vetoParticipantContainer}
                    onPress={() => handleVetoBy(person)}
                  >
                    <Text style={styles.vetoParticipantName}>
                      {person.firstName} {person.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.vetoButtonContainer}>
              <CustomButton
                text="Never Mind"
                width="94%"
                onPress={() => {
                  setVetoVisible(false);
                  setSelectedVisible(true);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  headline: {
    fontSize: 30,
    fontWeight: "600",
  },
  choiceScreenListContainer: {
    width: "94%",
    maxHeight: "45%",
  },
  choiceScreenListItem: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
    borderBottomWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    paddingVertical: 6,
  },
  choiceScreenListItemName: {
    flex: 1,
    fontSize: 16,
  },
  selectedContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  selectedInnerContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  selectedName: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  selectedDetails: {
    paddingTop: 80,
    paddingBottom: 80,
    alignItems: "center",
  },
  selectedDetailsLine: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 6,
  },
  vetoContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  vetoContainerInner: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 16,
  },
  vetoHeadline: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  vetoScrollViewContainer: {
    height: "50%",
    width: "100%",
    marginTop: 20,
  },
  vetoParticipantContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  vetoParticipantName: {
    fontSize: 24,
    textAlign: "center",
  },
  vetoButtonContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
  },
});

export default ChoiceScreen;