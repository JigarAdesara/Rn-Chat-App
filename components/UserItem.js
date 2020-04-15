import React from 'react';
import { Platform, View, StyleSheet, Text, Image, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import Colors from '../constants/colors';

import UserAvatar from 'react-native-user-avatar';
import moment from 'moment';

const UserItem = props => {

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={styles.touchable}>
            <TouchableCmp onPress={props.onItemClick} style={{ flex: 1 }} >
                <View style={styles.container}>
                    <View>
                        {/* <Image style={styles.image} source={require('../assets/default_user.png')} /> */}
                        <UserAvatar size="55" name={`${props.email}`} />
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.textName}>{props.email}</Text>
                        </View>
                    </View>
                </View>
            </TouchableCmp>
        </View>);
};

const styles = StyleSheet.create({
    touchable: {
        flex: 1,
    },
    container: {
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.26,
        shadowRadius: 10,
        elevation: 5,
        borderRadius: 10,
        padding: 12,
    },
    imageContainer: {
        width: 50,
        height: 50,
    },
    image: {
        width: '100%',
        height: '100%'
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    nameContainer: {
        flex: 1,
        marginVertical: 10,
        marginStart: 15,
        flexDirection: 'column',
    },
    textName: {
        fontSize: 18,
        color: '#000000'
    },
    textMsg: {
        fontSize: 14,
        color: Colors.primary,
        marginTop: 5
    }
});

export default UserItem;