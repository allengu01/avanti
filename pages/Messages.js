import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableHighlight,
} from 'react-native';
import { LatoRegular, LatoBold } from '../components/Fonts/LatoFont.js';
import { getCustomerName, getMessages, getProviderName, sendMessage } from '../api/marketplace.js';
import Message from '../components/Messages/Message.js';
import MessageHeader from '../components/Messages/MessageHeader.js';
import { getUser } from '../api/user.js';

const Messages = ({route, navigation}) => {
    const {user, other, data, userType} = route.params;
    const {session, booking, listing, provider, customer} = data;
    const otherID = (userType === "customer" ? provider.id : customer.id);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 200


    // Combines the message data with the included sender data
    const formatMessagesData = (dataArray, includedArray) => {
        return dataArray.map((message, i) => {
            const includedData = includedArray[i];
            const senderRelationshipID = message.relationships.sender.data.id;

            const senderData = includedArray.find(data => data.id === senderRelationshipID && data.type === "user");

            const formatted = {key: i.toString(),
                               message: message,
                               sender: senderData};
            return formatted;
        });
    };

    // Fetches the messages for the given transaction
    const fetchData = async () => {
        try {
            const transactionID = session.id;

            // Gets sessions data for user
            const messagesResponse = await getMessages(transactionID);
            const formattedMessages = formatMessagesData(messagesResponse.data, messagesResponse.included);
            setMessages(formattedMessages);            
        }
        catch(error) {
            console.log(error);
        }
    }

    // Sends a message from the text input
    const sendMessageInput = async () => {
        if (input == "") {
            return;
        }
        try {
            const messageResponse = await sendMessage(session.id, input);
            setInput("");
            await fetchData();
        }
        catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData(); // fetch on component load
        const interval = setInterval(() => { // set interval to 10s between fetches
            fetchData();
        }, 10000); // fetch messages every 10s
        return () => clearInterval(interval);
    }, [])

    useEffect(() => { // Sets the header of the navigation bar
        navigation.setOptions({
            headerTitle: (props) => <MessageHeader profileImage={other.data.relationships.profileImage} 
                                                   name={`${other.data.attributes.profile.displayName}.`}/>
        })
    }, [navigation])

    return (
        <View style={styles.background}>
            <SafeAreaView>
                <KeyboardAvoidingView style={styles.container} 
                                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                                    keyboardVerticalOffset={keyboardVerticalOffset}>
                    <FlatList
                        style={styles.list}
                        data={messages}
                        scrollEnabled={true}
                        inverted={true}
                        renderItem = {
                            ({item}) => <Message styles={styles.item}
                                                user={user}
                                                message={item.message} 
                                                sender={item.sender}/>
                        }
                    />
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={[styles.textInput]} 
                            onChangeText={setInput}
                            value={input}
                            placeholder='Aa'
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            autoCorrect={true} />
                        <TouchableHighlight 
                            // activeOpacity='0.3'
                            underlayColor="CDCDCD" 
                            style={[styles.touchableHighlight, styles.sendContainer]} 
                            onPress={() => sendMessageInput()}>
                            <View style={styles.button}>
                                <LatoBold style={styles.buttonText}>→</LatoBold>
                            </View>
                        </TouchableHighlight>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "white",
    },
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        width: "100%",
        backgroundColor: "white",
    },
    list: {
        flexGrow: 0,
        minHeight: 0,
        height: "100%",
    },
    inputContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "auto",
        marginTop: 10,
    },
    textInput: {
        height: 37,
        flex: 1,
        width: "auto",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#18D89F',
        borderRadius: 20,
        color: 'black',
        fontSize: 15,
    },
    sendContainer: {
        width: "auto",
        paddingLeft: 5,
        paddingBottom: 2,
        paddingTop: 2,
    },
    touchableHighlight: {
    },
    button: {
    },
    buttonText: {
        textAlign: "right",
        fontSize: 24,
        fontWeight: "bold",
        color: "#18D89F",
    }
})
export default Messages;
