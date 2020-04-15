import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '../constants/colors';

import moment from 'moment';

const SenderMessage = props => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.textStyle}>{props.message}</Text>
            </View>
            <Text style={styles.textDate}>{moment(props.date).format('MMMM Do YYYY, hh:mm')}</Text>
        </View>);
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    textContainer: {
        backgroundColor: Colors.primary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginHorizontal: 10,
        marginTop: 10,
        overflow: 'hidden'
    },
    textStyle: {
        color: '#000000',
        fontSize: 14,
        padding: 10,
        maxWidth: 200
    },
    textDate: {
        color: '#bdbdbd',
        fontSize: 12,
        marginRight: 10,
        marginVertical: 5
    }

});

export default SenderMessage;

