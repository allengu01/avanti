import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import { LatoRegular, LatoBold } from '../Fonts/LatoFont.js'
import PointsSection from '../Points/PointsSection.js';
import SessionsSection from '../Sessions/SessionsSection.js';
import AuthContext from '../../contexts/AuthContext.js';

const HelperHome = ({ navigation }) => {
    const { signOut } = useContext(AuthContext);
    const { user, data, userType, fetchData } = useContext(DataContext);

    return (
        <View style={styles.container}>
            <LatoBold style={styles.header}>Welcome, {user.attributes.profile.firstName}!</LatoBold>
            <SessionsSection navigation={navigation} user={user} data={data} fetchData={fetchData} userType={userType}/>
            {/* <PointsSection /> */}
            <TouchableHighlight 
                activeOpacity="0.85" 
                underlayColor="#CDCDCD" 
                style={styles.signOut} 
                onPress={() => signOut()}>
                <View style={styles.button}>
                    <LatoRegular style={styles.buttonText}>Sign out</LatoRegular>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        paddingLeft: 0,
        paddingRight: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "white",
    },
    header: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#18D89F"
    },
    signOut: {
        position: "absolute",
        right: 20,
        top: 60,
    },
    button: {
        alignSelf: "flex-start",
        borderBottomColor: "#18D89F",
        borderBottomWidth: 0.5,
    },
    buttonText: {
        fontSize: 12,
        color: "#18D89F",
    }
})
export default HelperHome;