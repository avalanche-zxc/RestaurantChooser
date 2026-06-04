import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({
  text,
  onPress,
  buttonStyle,
  textStyle,
  width,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        buttonStyle,
        width ? { width } : null,
        disabled ? styles.disabled : styles.enabled,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  enabled: {
    backgroundColor: "#007bff",
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CustomButton;