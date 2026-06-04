import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import CustomButton from "../../components/customButton";

const PostChoiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const restaurant = route.params?.restaurant || null;
  const participants = route.params?.participants || [];
  const filters = route.params?.filters || {};

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>Final Choice</Text>
        <Text style={styles.emptyText}>No restaurant was selected.</Text>
        <CustomButton
          text="Back to Start"
          width="70%"
          onPress={() => navigation.popToTop()}
        />
      </View>
    );
  }

  const renderParticipant = ({ item }) => (
    <View style={styles.participantItem}>
      <Text style={styles.participantName}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.participantRole}>
        {item.relationship}
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headline}>Final Choice</Text>

        <View style={styles.card}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.detail}>Cuisine: {restaurant.cuisine}</Text>
          <Text style={styles.detail}>Price: {restaurant.price}</Text>
          <Text style={styles.detail}>Rating: {restaurant.rating}</Text>
          <Text style={styles.detail}>Phone: {restaurant.phone}</Text>
          <Text style={styles.detail}>Address: {restaurant.address}</Text>
          <Text style={styles.detail}>Website: {restaurant.website}</Text>
          <Text style={styles.detail}>Delivery: {restaurant.delivery}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participants</Text>
          <FlatList
            data={participants.filter(Boolean)}
            keyExtractor={(item) => String(item.key)}
            renderItem={renderParticipant}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No participants were selected.</Text>
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filters</Text>
          <Text style={styles.filterLine}>
            Cuisine: {filters.cuisine || "Any"}
          </Text>
          <Text style={styles.filterLine}>
            Max Price: {filters.price || "Any"}
          </Text>
          <Text style={styles.filterLine}>
            Min Rating: {filters.rating || "Any"}
          </Text>
          <Text style={styles.filterLine}>
            Delivery: {filters.delivery || "Any"}
          </Text>
        </View>

        <CustomButton
          text="Back to Start"
          width="70%"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  headline: {
    fontSize: 30,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fafafa",
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
  },
  section: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  participantItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
  },
  participantRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  filterLine: {
    fontSize: 16,
    marginBottom: 6,
  },
});

export default PostChoiceScreen;