import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {LatoRegular, LatoBold} from '../Fonts/LatoFont.js';

const Message = ({ user, message, sender }) => {
    const content = message.attributes.content;
    const userID = user.id;
    const senderID = sender.id;

    if (userID === senderID) {
        return (
            <View style={youStyles.container}>
                <LatoRegular style={youStyles.name}>{message.attributes.content}</LatoRegular>
            </View>
        )
    }
    else {
        return (
            <View style={otherStyles.container}>
                <LatoRegular style={otherStyles.name}>{message.attributes.content}</LatoRegular>
            </View>
        )
    }
}

const youStyles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 5,
        marginBottom: 5,
        borderBottomColor: "#E5E5E5",
        borderBottomWidth: 1,
        borderRadius: 15,
        maxWidth: "80%",
        backgroundColor: "#18D89F",
        alignSelf: "flex-end"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    name: {
        fontSize: 15,
        color: "white",
    },
});

const otherStyles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 5,
        marginBottom: 5,
        borderColor: "#18D89F",
        borderWidth: 1,
        borderRadius: 15,
        maxWidth: "80%",
        backgroundColor: "white",
        alignSelf: "flex-start",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    name: {
        fontSize: 15,
        color: "#18D89F",
    },
});

export default Message;