import React, { useEffect, useState, useContext } from 'react';
import {View, Text, Button, FlatList, StyleSheet, TouchableHighlight} from 'react-native';
import {LatoRegular, LatoBold} from '../Fonts/LatoFont.js'
import SessionItem from './SessionItem.js';

const SessionsSection = ({ navigation }) => {
    const { user, data, userType, fetchData } = useContext(DataContext);

    return (
        <View style={styles.container}>
            <LatoBold style={styles.header}>Sessions</LatoBold>
            <FlatList
                style={styles.list}
                data={data.slice(0, 5)}
                scrollEnabled={false}
                renderItem = {
                    ({item, index}) => <SessionItem styles={styles.item}
                                             index={index}
                                             onPress={() => navigation.push("Detail", {index: index})}/>
                }
            />
            <TouchableHighlight 
                activeOpacity="0.85" 
                underlayColor="#CDCDCD" 
                style={styles.touchableHighlight} 
                onPress={() => navigation.push('SessionsList', {user: user, data: data, userType: userType})}>
                <View style={styles.button}>
                    <LatoRegular style={styles.buttonText}>See More...</LatoRegular>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 20,
    },
    header: {
        fontSize: 15,
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 10,
    },
    list: {
        flexGrow: 0,
        minHeight: 0,
        paddingBottom: 15,
    },
    item: {
        paddingTop: 10,
        fontSize: 18,
        height: 44,
    },
    touchableHighlight: {
        alignSelf: "flex-start",
    },
    button: {
        alignSelf: "flex-start",
        borderBottomColor: "black",
        borderBottomWidth: 0.5,
    },
    buttonText: {
        fontSize: 10,
        color: "black",
    }
})

export default SessionsSection;