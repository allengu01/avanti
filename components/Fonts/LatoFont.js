import React from 'react';
import {Text} from 'react-native';

export const LatoRegular = (props) => {
    return (
         <Text style={{fontFamily:'Lato-Regular'}} {...props} >{props.children}</Text>
    )
}

export const LatoBold = (props) => {
    return (
        <Text style={{fontFamily:'Lato-Bold'}} {...props} >{props.children}</Text>
   )
}