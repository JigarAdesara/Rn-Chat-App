import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ToastAndroid,
    AlertIOS,
    ScrollView,
    Alert
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { NavigationActions, NavigationEvents } from 'react-navigation';


import InputText from '../components/InputText';
import Card from '../components/Card';

import * as authActions from '../store/actions/auth';

import Colors from '../constants/colors';


const SettingScreen = props => {

    const userEmail = useSelector(state => state.auth.emailId);
    const username = useSelector(state => state.auth.username);
    const [userName, setUsername] = useState(username);
    const [isValid, setIsValid] = useState(true);
    const dispatch = useDispatch();

    const updateUserCall = async () => {

        if (userName === '') {
            setIsValid(false);
        } else {
            setIsValid(true);
            let actions;
            try {
                await dispatch(authActions.updateUser(userName));
                if (Platform.OS === 'android') {
                    ToastAndroid.show("Success", ToastAndroid.SHORT)
                } else {
                    AlertIOS.alert("Success");
                }

                props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: "Dashboard"
                    })
                );
            } catch (err) {
                console.log(err);
            }
        }
    };

    const logoutHandler = async () => {
        try {
            await dispatch(authActions.logout());
            props.navigation.dispatch(
                NavigationActions.navigate({
                    routeName: "Login"
                })
            );
        } catch (err) {
            console.log(err);
        }

    };

    const logout = () => {
        Alert.alert(
            "Are you sure?",
            "Want to logout from the app",
            [
                {
                    text: "No",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: logoutHandler
                }
            ],
            { cancelable: false }
        );
    };


    const textInputHandler = (text) => {
        // if (text === '') {
        //     setIsValid(false);
        // } else {
        //     setIsValid(true);
        // }
        setUsername(text);
    };

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={require('../assets/logo.png')} resizeMode={'contain'} />
                </View>
                <Card style={styles.contentContainer}>
                    <InputText
                        style={styles.disableInput}
                        placeholder="Email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={false}
                        keyboardType="email-address"
                        returnKeyType='next'
                        value={userEmail}
                    />
                    <InputText
                        style={styles.input}
                        placeholder="Username"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        returnKeyType='next'
                        onChangeText={textInputHandler}
                        value={userName}
                    />
                    {!isValid && <Text style={{ color: 'red', flex: 1, width: '80%' }}>Please enter Username</Text>}
                </Card>
                <TouchableOpacity
                    style={styles.button} onPress={updateUserCall}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        backgroundColor: '#ffffff',
        elevation: 5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    image: {
        width: '80%',
        height: '80%',
    },
    contentContainer: {
        width: '80%',
        // maxWidth: '80%',
        minHeight: 140,
        maxWidth: '90%',
        minWidth: 300,
        margin: 20,
        alignItems: 'center',

    },
    input: {
        width: '80%',
        height: 40,
        fontSize: 14,
        color: '#000000',
    }, disableInput: {
        width: '80%',
        height: 40,
        fontSize: 14,
        color: '#bfbfb0',
        borderBottomColor: '#bfbfb0'
    },
    button: {
        width: '40%',
        height: Platform.OS === 'android' ? 40 : 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        shadowOpacity: 0.26,
        elevation: 10,
        marginTop: 10
    },
    buttonText: {
        color: "#ffffff",
        fontSize: Platform.OS === 'android' ? 14 : 10
    },
    logoutText: {
        color: 'black',
        fontSize: Platform.OS === 'android' ? 16 : 12,
        margin: 15,
        borderBottomColor: 'black',
        borderBottomWidth: 1
    }
});

export default SettingScreen;