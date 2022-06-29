import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, TouchableHighlight, TextInput, Image, View } from 'react-native'
import { LatoRegular, LatoBold } from '../components/Fonts/LatoFont.js'
import AuthContext from '../contexts/AuthContext';

const SignUp = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // TODO: Implement error messages

    const { signUp } = useContext(AuthContext);

    const trySignUp = async () => {
        const signUpResponse = await signUp({ email, password, firstName, lastName, phoneNumber});
        if (signUpResponse.status != 200 && signUpResponse.title) {
            setError(signUpResponse.title);
        }
    }

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/images/logo.png')}/>
            <LatoBold style={[styles.text, styles.slogan]}>Hire students, not strangers.®</LatoBold>
            <View style={styles.inputContainer}>
                <View style={styles.underline}>
                    <LatoBold style={[styles.text, styles.signup]}>Sign Up</LatoBold>
                </View>
                <TextInput 
                    style={[styles.textInput]} 
                    onChangeText={setEmail} 
                    value={email}
                    placeholder='Email'
                    placeholderTextColor='rgba(255, 255, 255, 0.8)'
                    autoCapitalize='none'
                    autoCorrect={false} />
                <TextInput 
                    style={[styles.textInput]} 
                    onChangeText={setFirstName} 
                    value={firstName}
                    placeholder='First Name'
                    placeholderTextColor='rgba(255, 255, 255, 0.8)'
                    autoCorrect={false} />
                <TextInput 
                    style={[styles.textInput]} 
                    onChangeText={setLastName} 
                    value={lastName}
                    placeholder='Last Name'
                    placeholderTextColor='rgba(255, 255, 255, 0.8)'
                    autoCorrect={false} />
                <TextInput 
                    style={[styles.textInput]} 
                    onChangeText={setPhoneNumber} 
                    value={phoneNumber}
                    placeholder='Phone Number +1'
                    placeholderTextColor='rgba(255, 255, 255, 0.8)'
                    autoCapitalize='none'
                    autoCorrect={false} />
                <TextInput 
                    style={[styles.textInput]} 
                    onChangeText={setPassword} 
                    value={password}
                    placeholder='Create Password'
                    placeholderTextColor='rgba(255, 255, 255, 0.8)'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true} />
                <LatoRegular style={[styles.error]}>{error}</LatoRegular>
                <TouchableHighlight 
                    activeOpacity="0.85" 
                    underlayColor="rgba(255, 255, 255, 0.2)" 
                    onPress={() => trySignUp()}>
                    <View style={styles.underline}>
                        <LatoBold style={[styles.text, styles.signup]}>
                            <Text>Let's Go</Text>
                        </LatoBold>
                    </View>
                </TouchableHighlight>
                <LatoBold style={[styles.text]}>or</LatoBold>
                <TouchableHighlight 
                    activeOpacity="0.85" 
                    underlayColor="rgba(255, 255, 255, 0.2)" 
                    onPress={() => navigation.navigate('SignIn')}>
                    <View style={styles.underline}>
                        <LatoBold style={[styles.text, styles.login]}>go back to login</LatoBold>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        marginTop: 40,
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
        fontSize: 14,
    },
    signup: {
        fontSize: 20,
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

export default SignUp;