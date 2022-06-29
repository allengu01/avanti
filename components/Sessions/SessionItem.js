import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {LatoRegular, LatoBold} from '../Fonts/LatoFont.js'
import { getProviderName, getCustomerName, getBookingStartTime, getBookingEndTime, getStatus } from '../../api/marketplace.js';
import { getTime, getDate } from '../../api/helpers.js';

const SessionItem = ({ index, onPress }) => {
    const statusStyles = {"Pending": styles.pending, "Accepted": styles.accepted, "Declined": styles.declined, "Cancelled": styles.cancelled}
    const { user, data, userType, fetchData } = useContext(DataContext);
    const sessionData = data[index];
    const {session, booking, listing, provider, customer} = sessionData;
    const bookingStartTime = getBookingStartTime(booking);
    const bookingEndTime = getBookingEndTime(booking);
    const status = getStatus(booking);

    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true};
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <TouchableHighlight activeOpacity="1" underlayColor="transparent" style={styles.touchableHighlight} onPress={onPress}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        {(userType === "customer") ? 
                            <LatoRegular style={styles.name}>{`${getProviderName(provider)}.`}</LatoRegular> :
                            <LatoRegular style={styles.name}>{`${getCustomerName(customer)}.`}</LatoRegular>
                        }
                        <LatoRegular style={styles.time}>{`${getTime(bookingStartTime, timeOptions)} to ${getTime(bookingEndTime, timeOptions)}`}</LatoRegular>
                    </View>
                    <View style={styles.column}>
                        <LatoBold style={[styles.status, statusStyles[status]]}>{status}</LatoBold>
                        <LatoRegular style={[styles.date]}>{getDate(bookingEndTime, dateOptions)}</LatoRegular>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: "#E5E5E5",
        borderBottomWidth: 1,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    column: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    name: {
        fontSize: 15,
        color: "black",
    },
    status: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "right"
    },
    pending: {
        color: "#18D89F",
    },
    accepted: {
        color: "#616161",
    },
    declined: {
        color: "red",
    },
    cancelled: {
        color: "red",
    },
    time: {
        marginTop: 5,
        fontSize: 10,
        color: "#616161",
    },
    date: {
        marginTop: 5,
        fontSize: 10,
        color: "#616161",
        textAlign: "right",
    },
    touchableHighlight: {
        flexGrow: 0,
    },
});

export default SessionItem;