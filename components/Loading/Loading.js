import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const Loading = ({ user, message, sender }) => {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#18D89F",
    },
    logo: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
});

export default Loading;