import React from 'react';
import {View, Text, Button, FlatList, StyleSheet, TouchableHighlight, Linking} from 'react-native';
import {LatoRegular, LatoBold} from '../Fonts/LatoFont.js'
import PointsItem from './PointsItem.js';

const PointsSection = (props) => {
    const openAvantiLink = () => {
        const url = 'https://joinavanti.com'
        Linking.canOpenURL(url).then(() => {
            Linking.openURL(url);
        });
    }

    return (
        <View style={styles.container}>
            <LatoBold style={styles.header}>Your Points</LatoBold>
            <PointsItem title="From Bookings" value={1200} isBold={false} />
            <PointsItem title="From Referrals" value={5000} isBold={false} />
            <PointsItem title="From Other Stuff" value={400} isBold={false} />
            <View style={styles.separator}></View>
            <PointsItem title="Total" value={6600} isBold={true} />
            <TouchableHighlight activeOpacity="0.85" underlayColor="#CDCDCD" style={styles.touchableHighlight} onPress={openAvantiLink}>
                <View style={styles.button}>
                    <LatoRegular style={styles.buttonText}>Redeem them for free sessions and more at joinavanti.com.</LatoRegular>
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
    separator: {
        borderBottomColor: "#E5E5E5",
        borderBottomWidth: 1,
        marginBottom: 10,
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

export default PointsSection;