import React from 'react';
import { StyleSheet, TextInput } from 'react-native';


const InputText = props => {
  return <TextInput {...props} style={{ ...styles.input, ...props.style }}
  keyboardType="default" />;
};

const styles = StyleSheet.create({
  input: {
    height: 30,
    borderBottomColor:"#000000",
    borderBottomWidth:1
  }
});

export default InputText;
