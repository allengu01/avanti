import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import { LatoRegular, LatoBold } from '../components/Fonts/LatoFont.js';
import { getProviderName, getBookingStartTime, getBookingEndTime, getStatus, getPrice, getCustomerName, transitionTransaction, getTransaction } from '../api/marketplace.js';
import { getTime, getDate } from '../api/helpers.js';
import { getUser } from '../api/user.js';
import DataContext from '../contexts/DataContext.js';

const Detail = ({route, navigation}) => {
    const { index } = route.params;
    const { user, data, userType, fetchData } = useContext(DataContext);
    const sessionData = data[index];
    const {session, booking, listing, provider, customer} = sessionData;

    const otherName = (userType === "customer" ? getProviderName(provider) : getCustomerName(customer));
    const bookingStartTime = getBookingStartTime(booking);
    const bookingEndTime = getBookingEndTime(booking);
    const price = getPrice(listing);
    const status = getStatus(booking);

    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true};
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Opens the messages screen for the current transaction. Triggered by clicking the "Message _____" button
    const openMessages = async () => {
        const otherID = (userType === "customer" ? provider.id : customer.id); // TODO: Fetch this data on load instead?
        var other;
        try {
            // Get the other user (other = customer if current user is provider and provider if current user is customer)
            other = await getUser(otherID); // Fetching before transition makes it a bit smoother imo
            navigation.push('Messages', {user: user, other: other, data: sessionData, userType: userType})
        }
        catch(error) {
            console.log(error);
        }
    }

    const acceptTransaction = async () => {
        const transactionID = session.id;
        try {
            const transitionResponse = await transitionTransaction(transactionID, 'transition/accept'); // Accept transaction
            return await fetchData();
        }
        catch(error) {
            console.log(error);
        }
    }

    const declineTransaction = async () => {
        const transactionID = session.id;
        try {
            const transitionResponse = await transitionTransaction(transactionID, 'transition/decline'); // Decline transaction
            return await fetchData();
        }
        catch(error) {
            console.log(error);
        }
    }

    const getHeader = () => {
        switch (status) {
            case "Pending":
                return `You have requested a session with ${otherName}.!`
            case "Accepted":
                return `You have booked a session with ${otherName}.!`
            case "Declined":
                return `Your session with ${otherName}. was declined.`
            case "Cancelled":
                return `Your session with ${otherName}. was cancelled.`
            default:
                break;
        }
    }

    const getCaption = () => {
        switch (status) {
            case "Pending":
                return `You are awaiting ${otherName}.'s response.`
            case "Accepted":
                return `You have booked a session with ${otherName}.!`
            case "Declined":
                return `Your session with ${otherName}. was declined.`
            case "Cancelled":
                return `Your session with ${otherName}. was cancelled.`
            default:
                break;
        }
    }

    return (
        <View style={styles.container}>
            <LatoBold style={styles.header}>{getHeader()}</LatoBold>
            <View style={styles.underline}>
                <LatoRegular style={styles.status}>{getCaption()}</LatoRegular>
            </View>
            <View style={[styles.row, styles.bookingSection]}>
                <View style={styles.column}>
                    <LatoRegular style={styles.booking}>Booking Details:</LatoRegular>
                    <LatoRegular style={styles.booking}>{`${getTime(bookingStartTime, timeOptions)} to ${getTime(bookingEndTime, timeOptions)}`}</LatoRegular>
                    <LatoRegular style={styles.booking}>{getDate(bookingEndTime, dateOptions)}</LatoRegular>
                </View>
                <View style={styles.column}>
                    <LatoBold style={styles.cost}>{`$${price} an hour`}</LatoBold>
                </View>
            </View>
            {/* <View style={[styles.column, styles.helpSection]}>
                <LatoBold style={styles.helpHeader}>{`${otherName}.`} can help with:</LatoBold>
            </View> */}
            <TouchableHighlight 
                activeOpacity="0.3" 
                underlayColor="white" 
                style={styles.touchableHighlight} 
                onPress={openMessages}>
                <View style={[styles.button, styles.messageButton]}>
                    <LatoBold style={styles.messageButtonText}>{`Message ${otherName}.`}</LatoBold>
                </View>
            </TouchableHighlight>
            {(userType === "helper" && status === "Pending") ? 
                <View style={[styles.bottomButtonBar, styles.row]}>
                    <TouchableHighlight 
                        activeOpacity="0.3" 
                        underlayColor="white" 
                        style={styles.touchableHighlight} 
                        onPress={acceptTransaction}>
                        <View style={[styles.button, styles.acceptButton]}>
                            <LatoBold style={styles.acceptButtonText}>Accept</LatoBold>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        activeOpacity="0.3" 
                        underlayColor="white" 
                        style={styles.touchableHighlight} 
                        onPress={declineTransaction}>
                        <View style={[styles.button, styles.declineButton]}>
                            <LatoBold style={styles.declineButtonText}>Decline</LatoBold>
                        </View>
                    </TouchableHighlight>
                </View> :
                <></>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        width: "100%",
        backgroundColor: "white",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    column: {
        display: "flex",
        justifyContent: "center"
    },
    header: {
        marginTop: 10,
        fontSize: 17,
        fontWeight: "bold",
        textAlign: "left",
        color: "black"
    },
    underline: {
        alignSelf: "flex-start",
        borderBottomColor: "black",
        borderBottomWidth: 0.5,
    },
    status: {
        marginTop: 10,
        fontSize: 10,
        color: "black",
    },
    bookingSection: {
        marginTop: 50,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: "#E5E5E5",
        borderBottomWidth: 1,
    },
    booking: {
        color: "#616161",
        fontSize: 15,
        paddingTop: 3,
        paddingBottom: 3,
    },
    cost: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "right",
        color: "#18D89F"
    },
    helpSection: {
        paddingTop: 20,
    },
    helpHeader: {
        color: "#616161",
        fontSize: 15,
        fontWeight: "bold",
    },
    touchableHighlight: {
        alignSelf: "center",
        marginTop: 40,
    },
    button: {
        borderBottomWidth: 0.5,
    },
    messageButton: {
        borderBottomColor: "#18D89F",
    },
    messageButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#18D89F",
    },
    bottomButtonBar: {
    
    },
    acceptButton: {
        borderBottomColor: "#18D89F",
    },
    acceptButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#18D89F",
    },
    declineButton: {
        borderBottomColor: "red",
    },
    declineButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "red",
    }

})
export default Detail;
