import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { LatoRegular, LatoBold } from '../components/Fonts/LatoFont.js'
import CustomerHome from '../components/Home/CustomerHome.js';
import HelperHome from '../components/Home/HelperHome.js';
import Loading from '../components/Loading/Loading.js';
import DataContext from '../contexts/DataContext.js';

const Home = ({ route, navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    // const {user, data, userType} = route.params;
    const isFocused = useIsFocused();
    const { user, data, userType, fetchData } = useContext(DataContext);

    // On reload/update, get users' sessions using user ID
    useEffect(() => {
        if (isFocused) {
            fetchData();
            setIsLoading(false);
        }
    }, [isFocused]);

    if (isLoading) {
        return (
            <View>
                <Loading />
            </View>
        )
    }
    else {
        if (userType === "helper") {
            return (
                <View>
                    <HelperHome navigation={navigation} /> 
                </View>
            )
        }
        else if (userType === "customer") {
            return (
                <View>
                    <CustomerHome navigation={navigation} user={user} data={data} fetchData={fetchData} userType={userType} />
                </View>
            )
        }
        else {
            return (
                <></>
            )
        }
    }
}

const styles = StyleSheet.create({
    header: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#18D89F"
    }
})

export default Home;