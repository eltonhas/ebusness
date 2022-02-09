
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

import { getDocs, query, collection, where, onSnapshot } from 'firebase/firestore';

import { firestore } from '../../../connection/firebaseConnection';

import Separator from '../../../components/Separator';
import ScheduleItem from '../../../components/ScheduleItem';
import styles from "./styles";

export default function ScheduleList({ navigation }) {
  const [ agendamentos, setAgendamentos ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    getAgendamentos()
  }, []);

  function adicionaZero(numero) {
    if (numero <= 9) {
      return '0' + numero;
    }
    return numero;
  }

  function formatData(data) {
    let dataFormatada = adicionaZero(data.getDate().toString()) + '/' + (adicionaZero(data.getMonth() + 1).toString()) + '/' + data.getFullYear();
    dataFormatada += adicionaZero(data.getHours().toString()) + ':' + adicionaZero(data.getMinutes().toString())
    return dataFormatada;
  }

  function handleNewSchedule() {
    navigation.navigate('CreateSchedule');
  }

  function getAgendamentos() {
    setLoading(true);
    let dbConsulta = getDocs(query(collection(firestore, 'agendamentos'), where('status', '==', 'agendado'), where('idUsuario', '==', global.idUsuario)));

    if ((global.tipoUsuario === 'admin') || (global.tipoUsuario === 'operador')) {
      dbConsulta = getDocs(query(collection(firestore, 'agendamentos'), where('status', '==', 'agendado')));
    }

    dbConsulta.then((results)=>{
      const vetAgendamentos = [];
      results.docs.forEach(doc=>{
        const {
          placaVeiculo,
          idServico,
          precoServico,
          idFPagamento,
          status,
          obsStatus,
          idUsuario,
          nomeUsuario,
          emailUsuario,
          telefoneUsuario
        } = doc.data();

        vetAgendamentos.push({
          id: doc.id,
          dataHora: new Date(doc.data().dataHora.seconds * 10000),
          dataHoraFormatada: formatData(new Date(doc.data().dataHora.seconds * 10000)),
          precoServico,
          precoServicoFormatado: 'R$' + doc.data().precoServico.toFixed(2).replace('.', ','),
          idFPagamento,
          status,
          obsStatus,
          idUsuario,
          nomeUsuario,
          emailUsuario,
          telefoneUsuario
        });
      });
      setAgendamentos(vetAgendamentos);
      setLoading(false);
    })
  }

  return (
    <View style={styles.container}>
      <Separator marginVertical={8}/>

      {loading ? <ActivityIndicator size='large' color='#730000'/> : <></>}

      <TouchableOpacity style={styles.newButton} onPress={handleNewSchedule}>
        <Text style={styles.newButtonText}>Novo Agendamento</Text>
      </TouchableOpacity>

      <Separator marginVertical={6}/>

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        data={agendamentos}
        keyExtractor={(item, index)=> String(index)}
        renderItem={({item})=> <ScheduleItem item={item} navigation={navigation}/>}
      />

    </View>
  );
}