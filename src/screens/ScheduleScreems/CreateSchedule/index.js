
import react, {useState, useEffect} from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity,
   Alert, ActivityIndicator
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
import { Picker } from '@react-native-picker/picker';

import { collection, query, getDocs, where, getDoc, setDoc, doc } from 'firebase/firestore';

import { firestore } from '../../../connection/firebaseConnection';
import styles from "./styles";

export default function CreatSchedule({ navigation, route }) {
   const [state, setState] = useState({
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

   const [formasPagto, setFormasPagto] = useState([]);
   const [servicos, setServicos] = useState([]);

   const [statusSaveError, setStatusSaveError] = useState([]);
   const [messageSaveError, setMessageSaveError] = useState([]);

   const [loading, setLoading] = useState(false);

   useEffect(()=> {
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

         setFormasPagto(vetFormasPgto);
         setServicos(vetServicos);
      }).catch((error)=> {
         Alert.alert(
            "ERRO",
            "Erro ao tentar obter Serviços e Formas de Pagamento!"
         )
      })
   }, [navigation]);

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

   function cancelNewSchedule() {
      navigation.navigate('ScheduleList')
   }

   function saveNewSchedule() {
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

         const docRef = doc(firestore, "agendamentos", dataHoraAgendamento.getTime().toString());
         const agendamento = getDoc(docRef);

         if (agendamento.exists()) {
            setLoading(false);
            Alert.alert(
               "Data/Horário Ocupado",
               "Infelizmente alguém já agendou nesta data e horário!"
            )
         } else {
            const AGENDAMENTOS = collection(firestore, "agendamentos");
            const data = {
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

            setDoc(doc(AGENDAMENTOS, dataHoraAgendamento.getTime().toString(), data));

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

            setLoading(false);
            Alert.alert(
               "Data/Horário Disponível",
               "Agendamento efetuado com SUCESSO!"
            );

            navigation.navigate('ScheduleList')
         }
      }
   }

   return(
      <ScrollView style={styles.container}>
         <Text style={styles.titleText}>Novo Agendamento</Text>

         {loading ? <ActivityIndicator size="large" color="#730000"/> : <></>}

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
                  onValueChange={(value) => handleChangeText('hora', value)}   
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
               onValueChange={(value) => handleChangeText('idFPagamento', value)}   
            >
               <Picker.Item key='0' label='Selecione a forma de pagamento' value=''/>
               {formasPagto.map((forma) => (
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
            <TouchableOpacity style={styles.saveButton} onPress={saveNewSchedule}>
               <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
}