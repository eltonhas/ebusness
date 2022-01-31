
import React from "react";
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC300'
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#730000',
    marginBottom: 20,
    textAlign: 'center'
  },
  saveButton: {
    width: '50%',
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
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16
  },
  inputView: {
    marginTop: 20,
    width: '95%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#730000',
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
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
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;