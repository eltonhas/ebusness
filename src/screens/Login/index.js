
import React, { useState } from "react";
import { View, KeyboardAvoidingView, Text, TouchableOpacity, 
        TextInput, Image, Platform, ActivityIndicator 
      } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { auth, firestore } from '../../connection/firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import Separator from "../../components/Separator";

import imgLJ from '../../assets/car-wash.png';

import styles from './styles';

export default function Login({ navigation }) {

  const [state, setState] = useState({
    email: '',
    password: ''
  });

  const [passwordSecured, setPasswordSecured] = useState(true);
  const [statusLoginError, setStatusLoginError] = useState(false);
  const [messageLoginError, setMessageLoginError] = useState('');

  const [loading, setLoading] = useState(false);

  function handleChangeText(key, value) {
    if (statusLoginError) {
      setStatusLoginError(false);
    };

    setState({...state, [key]: value});
  }

  function requiredFields() {
    if(!state.email || !state.password) {
      return false;
    } else {
      return true;
    }
  }

  function handleRegister() {
    setState({
      email: '',
      password: ''
    });

    navigation.navigate('Register');
  }

  function loginFirebase() {
    if (!requiredFields()) {
      setMessageLoginError('Todos os campos são de \npreenchimento obrigatório');
      setStatusLoginError(true);
    } else {
      setLoading(true);
      signInWithEmailAndPassword(auth, state.email, state.password)
      .then(async (userCredential) => {
        setState({
          email: '',
          password: ''
        });

        const docRef = doc(firestore, "profile", userCredential.user.uid);
        const userProfile = await getDoc(docRef);

        if (userProfile.exists()) {
          global.idUsuario = userCredential.user.uid;
          global.nomeUsuario = userProfile.data().uid;
          global.emailUsuario = userProfile.data().uid;
          global.telefoneUsuario = userProfile.data().uid;
          global.tipoUsuario = userProfile.data().uid;
          setLoading(false);
          navigation.replace('HomeMenuBottomTab', {
            screen: 'Home',
            params: { uid: userCredential.user.uid, name: userCredential.user.displayName, email: userCredential.user.email }
          });
        }

      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/wrong-password':
            setMessageLoginError('Senha inválida!');
            break;
          case 'auth/user-not-found':
            setMessageLoginError('E-mail não cadastrado!');
            break;
          case 'auth/too-many-requests':
            setMessageLoginError('Bloqueio temporário. Várias tentativas \ncom senha inválida. Tente mais tarde!');
            break;
          case 'auth/user-disabled':
            setMessageLoginError('Conta de e-mail desativadas. \nContacte o administrador do sistema!');
            break;
          default:
            setMessageLoginError('Email e/ou Senha inválidos!');
        }
        setStatusLoginError(true);
        setLoading(false)
      })
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.titleText}>Lava a Jato G&G</Text>
      <Image style={styles.imgLogo} source={imgLJ}/>

      {loading ? <ActivityIndicator size="large" color="#730000"/> : <></>}

      <View style={styles.inputView}>
        <MaterialIcons name="email" size={24} color="#730000"/>
        <TextInput
          style={styles.input}
          value={state.email}
          onChangeText={(value) => handleChangeText('email', value)}
          placeholder={"E-mail"}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputView}>
        <MaterialIcons name="lock" size={24} color="#730000"/>
        <TextInput
          style={styles.input}
          value={state.password}
          onChangeText={(value) => handleChangeText('password', value)}
          secureTextEntry={passwordSecured}
          placeholder={"Senha"}
          textContentType="password"
          autoCapitalize="none"
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

      {
        statusLoginError ? (
          <View style={styles.contentAlert}>
            <MaterialIcons name="mood-bad" size={24} color='black'/>
            <Text style={styles.warningAlert}>{messageLoginError}</Text>
          </View>
        ) : (
          <View></View>
        )
      }

      <Separator marginVertical={10}/>

      <TouchableOpacity style={styles.loginButton} onPress={loginFirebase}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <Separator marginVertical={10}/>

      <Text style={styles.textSimple}>É novo por aqui?</Text>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastre-se</Text>
      </TouchableOpacity>

      <Separator marginVertical={10}/>
    </KeyboardAvoidingView>
  );
}