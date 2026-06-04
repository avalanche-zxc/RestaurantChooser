import React from "react";
import PropTypes from "prop-types";
import { Text, TextInput, View, StyleSheet } from "react-native";

const CustomTextInput = ({
  label,
  labelStyle,
  maxLength,
  textInputStyle,
  stateHolder,
  stateFieldName,
  error,
  ...props
}) => {
  const value = stateHolder?.state?.[stateFieldName] ?? "";

  const handleChangeText = (text) => {
    stateHolder.setState({
      [stateFieldName]: text,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          textInputStyle,
          error ? styles.inputError : null,
        ]}
        maxLength={maxLength}
        value={value}
        onChangeText={handleChangeText}
        {...props}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

CustomTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  labelStyle: PropTypes.object,
  maxLength: PropTypes.number,
  textInputStyle: PropTypes.object,
  stateHolder: PropTypes.shape({
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
  }).isRequired,
  stateFieldName: PropTypes.string.isRequired,
  error: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    marginLeft: 10,
    fontSize: 12,
  },
});

export default CustomTextInput;