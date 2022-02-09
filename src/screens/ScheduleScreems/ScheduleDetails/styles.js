
import React from "react";
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC300'
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#730000',
    marginBottom: 20,
    textAlign: 'center',
    margin: 20
  },
  inputButtonsView: {
    marginTop: 5,
    width: "95%",
    display: 'flex',
    flexDirection: "row",
    alignItems: 'center'
  },
  saveButton: {
    marginLeft: 20,
    width: '45%',
    height: 40,
    backgroundColor: '#E37D00',
    padding: 5,
    borderRadius: 5
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#730000',
    textAlign: 'center'
  },
  inputView: {
    flex: 1,
    padding: 0,
    marginBottom: 5,
    alignItems: 'center'
  },
  input: {
    width: '95%',
    height: 45,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#730000',
    marginBottom: 10
  },
  inputMultiline: {
    width: '95%',
    height: 120,
    padding: 10,
    borderWidth: 1,
    borderColor: "#730000",
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'justify'
  },
  viewTimePicker: {
    borderWidth: 1,
    borderColor: '#730000',
    width: '45%',
    height: 45,
    alignSelf: 'center',
    borderRadius: 5,
    marginLeft: 19,
    marginBottom: 15
  },
  inputTimePicker: {
    width: '100%',
    height: 44,
    transform: [
      { scaleX: 0.9 },
      { scaleY: 0.9 },
    ]
  },
  viewDatePicker: {
    width: '50%',
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#730000',
    paddingHorizontal: 8
  },
  datePicker: {
    width: '100%',
    height: 40
  },
  viewServicePicker: {
    borderWidth: 1,
    borderColor: '#730000',
    width: '95%',
    height: 45,
    alignSelf: 'center',
    borderRadius: 5,
    marginBottom: 5,
  },
  inputServicePicker: {
    width: '100%',
    height: 44,
    transform: [
      { scaleX: 0.9 },
      { scaleY: 0.9 },
    ]
  },
  textSimple: {
    color: '#730000',
    width: '95%',
    textAlign: 'justify'
  },
  warningText: {
    paddingLeft: 2,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  contentAlert: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;