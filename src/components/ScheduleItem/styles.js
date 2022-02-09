
import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3B4',
    margin: 15,
    width: "100%",
    borderRadius: 10,
    padding: 5
  },
  itemLayoutDetail: {
    flexDirection: 'row'
  },
  itemTextName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#730000'
  },
  itemTextNameRed: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red'
  },
  itemTextDetailTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#730000'
  },
  itemTextDetail: {
    fontSize: 15,
  },
  itemTextDetailMultiline: {
    fontSize: 15,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end'
  },
  editButton: {
    marginLeft: 10,
    height: 30,
    backgroundColor: '#D26900',
    borderRadius: 7,
    padding: 5,
    fontSize: 12,
    elevation: 10,
    shadowOpacity: 10,
    shadowColor: '#CCC',
    alignItems: 'center'
  },
  deleteButton: {
    marginLeft: 10,
    height: 30,
    backgroundColor: '#D26900',
    borderRadius: 7,
    padding: 5,
    fontSize: 12,
    elevation: 10,
    shadowOpacity: 10,
    shadowColor: '#CCC',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  }

});

export default styles;