import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import { LatoBold } from '../Fonts/LatoFont';

const MessageHeader = ({ profileImage, name }) => {
    return (
        <View style={styles.container}>
            {profileImage && profileImage.data ?
                <Image style={styles.image} source={{uri: profileImage.data.attributes.variants.default.url}}/> :
                <></>
            }
            <LatoBold style={styles.title}>{name}</LatoBold>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
        marginLeft: 5
    }
})

export default MessageHeader;