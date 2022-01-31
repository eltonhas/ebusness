
import React from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import styles from './styles';
import CarWash from '../../assets/car-wash.png';

import Separator from '../../components/Separator';

export default function Home({ route }) {
  return(
    <View style={styles.container}>
      <Text style={styles.titleText}>Lava a Jato G&G!</Text>
      <Image
        style={styles.imgLogo}
        source={CarWash}
      />

      <Text style={styles.helloText}>Olá {route.params?.name}</Text>
      <Text style={styles.helloText}>Seja bem-vindo(a)!</Text>

      <Separator marginVertical={10}/>

      <Text style={styles.helloText}>Não perca tempo e agende agora</Text>

      <View style={styles.contentAlert}>
        <Text style={styles.helloText}>a lavagem do seu carro. </Text>
        <View style={styles.contentAlert}></View>

        <FontAwesome5
          name='smile-wink'
          size={24}
          color='#730000'
        />
      </View>
    </View>
  );
}
