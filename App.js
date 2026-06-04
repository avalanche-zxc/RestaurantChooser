import "react-native-gesture-handler";
import React from "react";
import AppNavigation from "./src/components/navigation";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <AppNavigation />
      <Toast />
    </>
  );
}