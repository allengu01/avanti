import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {LatoRegular, LatoBold} from '../Fonts/LatoFont.js'

const PointsItem = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {props.isBold ? (
                    <LatoBold style={[styles.bold, styles.title]}>{props.title}</LatoBold>
                ) : (
                    <LatoRegular style={styles.title}>{props.title}</LatoRegular>
                )}
                <LatoBold style={styles.value}>{props.value}</LatoBold>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        paddingBottom: 15,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bold: {
        fontWeight: "bold",
    },
    title: {
        fontSize: 15,
        color: "black",
    },
    value: {
        fontSize: 15,
        color: "#18D89F",
        fontWeight: "bold",
    }
});

export default PointsItem;