import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, View, Text, 
          TextInput, TouchableOpacity, ActivityIndicator
        } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { auth, firestore } from '../../connection/firebaseConnection';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

import styles from './styles';

import Separator from "../../components/Separator";

export default function Register({ navigation }) {

  const [state, setState] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordSecured, setPasswordSecured] = useState(true);
  const [passwordConfirmSecured, setPasswordConfirmSecured] = useState(true);
  const [statusRegisterError, setStatusRegisterError] = useState(false);
  const [messageRegisterError, setMessageRegisterError] = useState('');

  const [loading, setLoading] = useState(false);

  function handleChangeText(key, value) {
    if (statusRegisterError) {
      setStatusRegisterError(false);
    };

    setState({...state, [key]: value});
  }

  function requiredFields() {
    if(!state.name || !state.phone || !state.email || !state.password || !passwordConfirm) {
      return false;
    } else {
      return true;
    }
  }

  function validPassword() {
    if (state.password !== passwordConfirm) {
      return false;
    } else {
      return true;
    }
  }

  function registerFirebase() {
    if (!requiredFields()) {
      setMessageRegisterError('Todos os campos são de \npreenchimento obrigatório');
      setStatusRegisterError(true);
    } else {
      setLoading(true);
      createUserWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        let userName = state.name, userEmail = state.email;

        updateProfile(auth.currentUser, {
          displayName: userName
        });

        const PROFILE = collection(firestore, "profile");
        const data = {
          displayName: state.name,
          email: state.email,
          phoneNumber: state.phone,
          costumerType: 'cliente'
        };

        setDoc(doc(PROFILE, userCredential.user.uid), data);

        setState({
          name: '',
          email: '',
          phone: '',
          password: '',
        });
        setPasswordConfirm('');

        setLoading(false);

        navigation.replace('HomeMenuBottomTab', {
          screen: 'Home',
          params: { uid: userCredential.user.uid, name: userName, email: userEmail }
        });

      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setMessageRegisterError('E-mail já cadastrado!');
        } else {
          console.log(error);
          setMessageRegisterError('E-mail e/ou Senha inválidos \n(Senha com mínimo de 6 caracteres)')
        }
      })
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.titleText}>Daods do Usuário</Text>

      {loading ? <ActivityIndicator size="large" color="#730000"/> : <></>}

      <View style={styles.inputView}>
        <MaterialIcons name="email" size={24} color='#730000'/>
        <TextInput
          style={styles.input}
          value={state.email}
          onChangeText={(value) => handleChangeText('email', value)}
          placeholder={'E-mail'}
          keyboardType='email-address'
          textContentType="emailAddress"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputView}>
        <FontAwesome5 name='user' size={24} color='#730000'/>
        <TextInput
          style={styles.input}
          value={state.name}
          onChangeText={(value) => handleChangeText('name', value)}
          placeholder={'Nome'}
        />
      </View>
      
      <View style={styles.inputView}>
        <MaterialIcons name='phone' size={24} color='#730000'/>
        <TextInput
          style={styles.input}
          value={state.phone}
          onChangeText={(value) => handleChangeText('phone', value)}
          placeholder={'Telefone'}
          keyboardType='numeric'
        />
      </View>
      
      <View style={styles.inputView}>
        <FontAwesome5 name='lock' size={24} color='#730000'/>
        <TextInput
          style={styles.input}
          value={state.password}
          secureTextEntry={passwordSecured}
          onChangeText={(value) => handleChangeText('password', value)}
          placeholder={'Senha'}
          textContentType='password'
          autoCapitalize='none'
        />

        <TouchableOpacity
          style={styles.touchleIcon}
          onPress={() => setPasswordSecured(!passwordSecured)}
        >
          {
            passwordSecured ? (
              <FontAwesome5 name='eye-slash' type='font-awesome' size={20} color='#730000'/>
            ) : (
              <FontAwesome5 name='eye' type='font-awesome' size={20} color='#730000'/>
            )
          }
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputView}>
        <FontAwesome5 name='lock' size={24} color='#730000'/>
        <TextInput
          style={styles.input}
          value={passwordConfirm}
          secureTextEntry={passwordConfirmSecured}
          onChangeText={(value) => setPasswordConfirm(value)}
          placeholder={'Confirmar senha'}
          textContentType='password'
          autoCapitalize='none'
        />

        <TouchableOpacity
          style={styles.touchleIcon}
          onPress={() => setPasswordConfirmSecured(!passwordConfirmSecured)}
        >
          {
            passwordConfirmSecured ? (
              <FontAwesome5 name='eye-slash' type='font-awesome' size={20} color='#730000'/>
            ) : (
              <FontAwesome5 name='eye' type='font-awesome' size={20} color='#730000'/>
            )
          }
        </TouchableOpacity>
      </View>

      {
        statusRegisterError ? (
          <View style={styles.contentAlert}>
            <MaterialIcons name="mood-bad" size={24} color='black'/>
            <Text style={styles.warningAlert}>{messageRegisterError}</Text>
          </View>
        ) : (
          <View></View>
        )
      }

      <Separator marginVertical={10}/>

      <TouchableOpacity style={styles.saveButton} onPress={registerFirebase}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

      <Separator marginVertical={30}/>

    </KeyboardAvoidingView>
  );
}