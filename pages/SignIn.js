import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, TouchableHighlight, TextInput, Image, View } from 'react-native';
import { LatoRegular, LatoBold } from '../components/Fonts/LatoFont.js';
import AuthContext from '../contexts/AuthContext';

const SignIn = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { signIn } = useContext(AuthContext);

    const trySignIn = async () => {
        const signInError = await signIn({ username, password });
        if (signInError) {
            setError(signInError);
        }
    }

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/images/logo.png')}/>
            <LatoBold style={[styles.text, styles.slogan]}>Hire students, not strangers.®</LatoBold>
            <View style={styles.inputContainer}>
                <View style={styles.underline}>
                    <LatoBold style={[styles.text, styles.login]}>Login</LatoBold>
                </View>
                <TextInput 
                    style={[styles.textInput]} 
                    onChangeText={setUsername} 
                    value={username}
                    placeholder='Username'
                    placeholderTextColor='rgba(255, 255, 255, 0.8)'
                    autoCapitalize='none'
                    autoCorrect={false} />
                <TextInput 
                    style={[styles.textInput]} 
                    onChangeText={setPassword} 
                    value={password}
                    placeholder='Password'
                    placeholderTextColor='rgba(255, 255, 255, 0.8)'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true} />
                <LatoRegular style={[styles.error]}>{error}</LatoRegular>
                <TouchableHighlight 
                    activeOpacity="0.85" 
                    underlayColor="rgba(255, 255, 255, 0.2)" 
                    onPress={() => trySignIn()}>
                    <View style={styles.underline}>
                        <LatoBold style={[styles.text, styles.login]}>Let's Go</LatoBold>
                    </View>
                </TouchableHighlight>
                <LatoBold style={[styles.text]}>or</LatoBold>
                <TouchableHighlight 
                    activeOpacity="0.85" 
                    underlayColor="rgba(255, 255, 255, 0.2)" 
                    onPress={() => navigation.navigate('SignUp')}>
                    <View style={styles.underline}>
                        <LatoBold style={[styles.text, styles.signup]}>go to sign up</LatoBold>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    lato: {
        fontFamily: 'Lato'
    },
    container: {
        backgroundColor: '#18D89F',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 100,
    },
    logo: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 80,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    underline: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        margin: 10,
    },
    slogan: {
        fontSize: 18,
    },
    login: {
        fontSize: 20,
    },
    signup: {
        fontSize: 14,
    },
    error: {
        color: 'red',
        fontSize: 14
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        height: 37,
        width: '80%',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        color: 'white',
        marginTop: 8,
        marginBottom: 8,
        fontSize: 18,
    }
});

export default SignIn;