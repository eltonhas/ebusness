
import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity,
  Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import { Picker } from '@react-native-picker/picker';

import { doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

import { firestore } from '../../../connection/firebaseConnection';

import styles from './styles';

export default function ScheduleDetails(props) {
  
  const [state, setState] = useState({
    id: "",
    placaVeiculo: "",
    data: "",
    hora: "",
    status: "",
    obsStatus: "",
    idFPagamento: "",
    idServico: "",
    precoServico: "",
    idUsuario: '',
    nomeUsuario: '',
    emailUsuario: '',
    telefoneUsuario: '',
  });

  const [ dataOriginal, setDataOriginal ] = useState('');
  const [ horaOriginal, setHoraOriginal ] = useState('');

  const [ formasPgto, setFormasPgto ] = useState([]);
  const [ servicos, setServicos ] = useState([]);

  const [ statusSaveError, setStatusSaveError ] = useState(false);
  const [ messageSaveError, setMessageSaveError ] = useState('');

  const [ loading, setLoading ] = useState(true);

  useEffect(()=> {
    getAgendamento(props.route.params.idAgendamento)
    Promise.all([
      getDocs(query(collection(firestore, 'FormasPagamento'), where('disponivel', '==', true))),
      getDocs(query(collection(firestore, 'Servicos'), where('disponivel', '==', true))),
    ]).then((results) => {
      const formasPgtoDisponiveis = results[0];
      const servicosDisponiveis = results[1];

      let vetFormasPgto = [];
      let vetServicos = [];

      formasPgtoDisponiveis.forEach((document)=> {
        vetFormasPgto.push({ label: document.data().descricao, value: document.id });
      })
      servicosDisponiveis.forEach((document)=> {
          vetServicos.push({
          label: `${document.data().descricao} (R$ ${document.data().preco.toFixed(2).replace(".", ",")})`, 
          value: document.id,
          preco: document.data().preco 
        });
      });

      setFormasPgto(vetFormasPgto);
      setServicos(vetServicos);
    }).catch((error)=> {
      Alert.alert(
        "ERRO",
        "Erro ao tentar obter Serviços e Formas de Pagamento!"
      )
    })
  }, []);

  function adicionaZero(numero) {
    if (numero <= 9) {
      return '0' + numero;
    }
    return numero;
  }

  function formatData(data) {
    let dataFormatada = adicionaZero(data.getDate().toString()) + '/' + (adicionaZero(data.getMonth() + 1).toString()) + '/' + data.getFullYear();
    return dataFormatada;
  }


  function handleChangeText(key, value) {
    if (statusSaveError) {
      setStatusSaveError(false);
    };

    setState({...state, [key]: value});
  }

  function handleChangeServico(id, preco) {
    if(statusSaveError) {
      setStatusSaveError(false);
    }
    setState({ ...state, idServico: id, precoServico: preco})
  }

  function fieldsFilleds() {
    if (state.placaVeiculo && state.data && state.hora && state.idFPagamento && state.idServico) {
      return true;
    } 
    return false;
  }

  function limparVariaveisEstado() {
    setDataOriginal('');
    setHoraOriginal('');
    setState({
      placaVeiculo: "",
      data: "",
      hora: "",
      status: "",
      obsStatus: "",
      idFPagamento: "",
      idServico: "",
      precoServico: "",
      idUsuario: global.IdUsuario,
      nomeUsuario: global.nomeUsuario,
      emailUsuario: global.emailUsuario,
      telefoneUsuario: global.telefoneUsuario,
    });
  };

  function cancelNewSchedule() {
    limparVariaveisEstado();
    navigation.navigate('ScheduleList');
  };

  async function getAgendamento(id) {
    const docRef = doc(firestore, "agendamentos", id);
    const docAgend = await getDoc(docRef);

    if (docAgend.exists()) {
      const agendamento = docAgend.data();

      let objAgendamento = {
        ...agendamento,
        id: docAgend.id,
        data: formatData(new Date(docAgend.data().dataHora.seconds * 1000)),
        hora: adicionaZero((new Date(docAgend.data().dataHora.seconds * 1000)).getHours()) + ':' +
        adicionaZero((new Date(docAgend.data().dataHora.seconds * 1000)).getMinutes())
      }

      setState(objAgendamento);

      setDataOriginal(objAgendamento.data);
      setHoraOriginal(objAgendamento.hora);

      setLoading(false)
    }
  }

  function updateSchedule() {
    if (!fieldsFilleds()) {
      setMessageSaveError('Apenas o campo Recado/Observação não é de \npreenchimento obrigatório!');
      setStatusSaveError(true);
    } else {
      setLoading(true);

      let dataHoraAgendamento = new Date(
        Date.parse(
          state.data.slice(6, 10) + '/' +
          state.data.slice(3, 5) + '/' +
          state.data.slice(0, 2) + ' ' +
          state.hora.slice(0, 2) + ':' +
          state.hora.slice(3, 5)
        )
      );

      const objUpdate = {
        placaVeiculo: state.placaVeiculo,
        dataHora: dataHoraAgendamento,
        status: 'agendado',
        obsStatus: state.obsStatus,
        idFPagamento: state.idFPagamento,
        idServico: state.idServico,
        precoServico: state.precoServico,
        idUsuario: state.idUsuario,
        nomeUsuario: state.nomeUsuario,
        emailUsuario: state.emailUsuario,
        telefoneUsuario: state.telefoneUsuario,
      };
      const AGENDAMENTOS = collection(firestore, 'agendamentos')

      if ((state.data == dataOriginal) && (state.hora ==horaOriginal)) {
        const docRef = doc(AGENDAMENTOS, state.id);
        updateDoc(docRef, objUpdate)
        .then(()=>{
          limparVariaveisEstado();
          Alert.alert(
            'Data/Horário Disponível',
            'Agendamento atualizado com SUCESSO!'
          );
          props.navigation.navigate('ScheduleList');
        }).catch((error)=>{
          Alert.alert(
            'ERRO',
            'Erro ao tentar atualizar o agendamento!'
          );
        })
      } else {
        const docRef = doc(firestore, "agendamentos", dataHoraAgendamento.getTime().toString());
        const agendamento = getDoc(docRef);

        if (agendamento.exists()) {
          Alert.alert(
            "Data/Horário Ocupado",
            "Infelizmente alguém já agendou nesta data e horário!"
          );
        } else {
          setDoc(doc(AGENDAMENTOS, dataHoraAgendamento.getTime().toString(), objUpdate))
          .then(()=>{
            let dataHoraOriginal = new Date(
              Date.parse(
                state.data.slice(6, 10) + '/' +
                state.data.slice(3, 5) + '/' +
                state.data.slice(0, 2) + ' ' +
                state.hora.slice(0, 2) + ':' +
                state.hora.slice(3, 5)
              )
            );
            const docRef = doc(INGREDIENTES, dataHoraOriginal.getTime().toString());
            deleteDoc(docRef)
            .then(()=>{
              console.log('Documento deletado com sucesso!');
            }).catch(error => {
              console.log('Erro ao tentar deletar documento de id anterior', error);
            });

            limparVariaveisEstado();
            Alert.alert(
              "Data/Horário Disponível",
              "Agendamento atualizado com SUCESSO!"
            );
            props.navigation.navigate('ScheduleList');
          }).catch(error => {
            Alert.alert(
              "ERRO",
              "Erro ao tentar gravar o agendamento!"
            );
          })
        }
      }
    }
  }

  return(
    <ScrollView style={styles.container}>
      <Text style={styles.titleText}>Dados Agendamento</Text>

      {loading ? <ActivityIndicator size='large' color='#730000'/> : <></>}

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          value={state.placaVeiculo}
          onChange={(value) => handleChangeText('placaVeiculo', value)}
          placeholder={'Placa Veiculo'}
          placeholderTextColor='black'
          autoCapitalize={'characters'}
          clearButtonMode="always"
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', width: '95%', alignSelf: 'center'}}>
        <View style={styles.viewDatePicker}>
            <DatePicker
              style={styles.datePicker}
              date={state.data}
              placeholder='Selecione a Data'
              mode='date'
              format="DD/MM/YYYY"
              minDate={new Date()}
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={
                <MaterialCommunityIcons
                  style={ { marginTop: 5 } }
                  size={30}
                  color="#730000"
                  name="calendar-month"
                />
              }
              customStyles={{
                  dateInput: {
                    marginLeft: 0,
                    marginTop: 4,
                    height: 40,
                    width: '50%',
                    borderColor: '#FFC300',
                    borderRadius: 5
                  },
                  placeholderText: { color: 'black' }
              }}
              onDateChange={(value) => handleChangeText('data', value)}
            />
        </View>
        <View style={styles.viewTimePicker}>
            <Picker
              style={styles.inputTimePicker}
              dropdownIconColor='#730000'
              selectedValue={state.hora}
              onValueChange={(value, itemIndex) => handleChangeText('hora', value)}   
            >
              <Picker.Item key='0' label='Horário' value=''/>
              <Picker.Item key='1' label='08:00' value='08:00'/>
              <Picker.Item key='2' label='08:30' value='08:30'/>
              <Picker.Item key='3' label='09:00' value='09:00'/>
              <Picker.Item key='4' label='09:30' value='09:30'/>
              <Picker.Item key='5' label='10:00' value='10:00'/>
              <Picker.Item key='6' label='10:30' value='10:30'/>
              <Picker.Item key='7' label='11:00' value='11:00'/>
              <Picker.Item key='8' label='11:30' value='11:30'/>
              <Picker.Item key='9' label='14:00' value='14:00'/>
              <Picker.Item key='10' label='14:30' value='14:30'/>
              <Picker.Item key='11' label='15:00' value='15:00'/>
              <Picker.Item key='12' label='15:30' value='15:30'/>
              <Picker.Item key='13' label='16:00' value='16:00'/>
              <Picker.Item key='14' label='16:30' value='16:30'/>
              <Picker.Item key='15' label='17:00' value='17:00'/>
              <Picker.Item key='16' label='17:30' value='17:30'/>
            </Picker>
        </View>
      </View>
      <View style={styles.viewServicePicker}>
        <Picker
          style={styles.inputServicePicker}
          dropdownIconColor='#730000'
          selectedValue={state.idServico}
          onValueChange={(value, itemIndex) => handleChangeServico(value, servicos[itemIndex - 1].preco)}   
        >
          <Picker.Item key='0' label='Selecione o Serviço' value=''/>
          {servicos.map((servico) => (
            <Picker.Item key={servico.value.id} label={servico.label} value={servico.value}/>
          ))}
        </Picker>
      </View>
      <View style={styles.viewServicePicker}>
        <Picker
            style={styles.inputServicePicker}
            dropdownIconColor='#730000'
            selectedValue={state.idFPagamento}
            onValueChange={(value, itemIndex) => handleChangeText('idFPagamento', value)}   
        >
            <Picker.Item key='0' label='Selecione a forma de pagamento' value=''/>
            {formasPgto.map((forma) => (
              <Picker.Item key={forma.value} label={forma.label} value={forma.value}/>
            ))}
        </Picker>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputMultiline}
          value={state.obsStatus}
          onChange={(value) => handleChangeText('obsStatus', value)}
          placeholder={'Recado/Observação'}
          multiline={true}
          maxLength={300}
          placeholderTextColor='black'
          clearButtonMode="always"
        />
      </View>

      {
        statusSaveError ? (
          <View style={styles.contentAlert}>
            <MaterialIcons name="mood-bad" size={24} color='black'/>
            <Text style={styles.warningAlert}>{messageSaveError}</Text>
          </View>
        ) : (
          <View></View>
        )
      }

      <View style={styles.inputButtonsView}>
        <TouchableOpacity style={styles.saveButton} onPress={cancelNewSchedule}>
          <Text style={styles.saveButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={updateSchedule}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );

}