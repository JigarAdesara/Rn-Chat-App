import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '../constants/colors';
import moment from 'moment';

import UserAvatar from 'react-native-user-avatar';

const ReceiverMessage = props => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <UserAvatar size="40" name={`${props.email}`} />
                <View style={styles.textContainer}>
                    <Text style={styles.textStyle}>{props.message}</Text>
                </View>
            </View>
            <Text style={styles.textDate}>{moment(props.date).format('MMMM Do YYYY, hh:mm')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 5,
    },
    textContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginHorizontal: 5,
        overflow: 'hidden',
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

        marginVertical: 5,
        marginHorizontal: 45
    }
});

export default ReceiverMessage;

