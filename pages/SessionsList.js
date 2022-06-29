import React, {useEffect, useContext} from 'react';
import {View, Text, Button, FlatList, StyleSheet, TouchableHighlight} from 'react-native';
import {LatoRegular, LatoBold} from '../components/Fonts/LatoFont.js'
import SessionItem from '../components/Sessions/SessionItem';

const SessionsList = ({ route, navigation }) => {
    const { user, data, userType, fetchData } = useContext(DataContext);

    return (
        <View style={styles.container}>
            <LatoBold style={styles.header}>Sessions</LatoBold>
            <FlatList
                style={styles.list}
                data={data}
                renderItem = {
                    ({item, index}) => <SessionItem styles={styles.item}
                                             index={index}
                                             onPress={() => navigation.push("Detail", {index: index})}/>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        width: "100%",
        backgroundColor: "white",
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
        height: "100%"
    },
    item: {
        paddingTop: 10,
        fontSize: 18,
        height: 44,
    },
})

export default SessionsList;