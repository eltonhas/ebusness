import react from "react";
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import styles from "./styles";

import { firestore } from "../../connection/firebaseConnection";
import { collection, doc, deleteDoc } from "firebase/firestore";

export default function ScheduleItem(props) {
  
  function handleEditButton() {
    props.navigation.navigate("ScheduleDetails", { idAgendamento: props.item.id });
  }

  function handleDeletePress() {
    Alert.alert(
      "Atenção:",
      `Tem certeza que deseja excluir o agendamento do veículo placa: ${props.item.placaVeiculo}?`,
      [
        {
          text: "Não",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: () => {
            const AGENDAMENTO = collection(firestore, "agendamento");

            const docRef = doc(AGENDAMENTO, props.item.id);

            deleteDoc(docRef)
            .then(() => 
              Alert.alert('Agendamento EXCLUÍDO com sucesso!')
            ).catch(e => {
              Alert.alert('ERRO ao tentar deletar Agendamente!')
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  return(
    <View style={styles.container}>
      <Text style={styles.itemTextName}>
        Veiculo Placa: <Text style={styles.itemTextNameRed}>{props.item.placaVeiculo}</Text>
      </Text>

      <View style={styles.itemLayoutDetail}>
        <Text style={styles.itemTextDetailTitle}>
          Data-Hora: Agendada: <Text style={styles.itemTextDetail}>{props.item.dataHoraFormatada}</Text>
        </Text>
      </View>

      <View style={styles.itemLayoutDetail}>
        <Text style={styles.itemTextDetailTitle}>
          Serviço: <Text style={styles.itemTextDetail}>{props.item.idServico}</Text>
        </Text>
      </View>

      <View style={styles.itemLayoutDetail}>
        <Text style={styles.itemTextDetailTitle}>
          Preço: <Text style={styles.itemTextDetail}>{props.item.precoServicoFormatado}</Text>
        </Text>
      </View>

      <View style={styles.itemLayoutDetail}>
        <Text style={styles.itemTextDetailTitle}>
          Forma Pagamento: <Text style={styles.itemTextDetail}>{props.item.idFPagamento}</Text>
        </Text>
      </View>

      <View style={styles.itemLayoutDetail}>
        <Text style={styles.itemTextDetailTitle}>
          Recado/Observação: <Text style={styles.itemTextDetail}>{props.item.obsStatus}</Text>
        </Text>
      </View>

      <View style={styles.itemLayoutDetail}>
        <Text style={styles.itemTextDetailTitle}>
          Cliente/Resp: <Text style={styles.itemTextDetail}>{props.item.nomeUsuario}</Text>
        </Text>
      </View>

      <View style={styles.itemLayoutDetail}>
        <Text style={styles.itemTextDetailTitle}>
          Email: <Text style={styles.itemTextDetail}>{props.item.emailUsuario}</Text>
        </Text>
      </View>

      <View style={styles.itemLayoutDetail}>
        <Text style={styles.itemTextDetailTitle}>
          Telefone: <Text style={styles.itemTextDetail}>{props.item.telefoneUsuario}</Text>
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
          <MaterialIcons name="delete-forever" color="FFF" size={20}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={handleEditButton}>
          <MaterialIcons name="file-document-edit-outline" color="FFF" size={20}/>
        </TouchableOpacity>
      </View>

    </View>
  );
}