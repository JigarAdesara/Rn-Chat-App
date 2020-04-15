import React, { useState, useReducer, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as authActions from '../store/actions/auth'

import InputText from '../components/InputText';
import Card from '../components/Card';

import Colors from '../constants/colors';

const FORM_LOGIN = 'FORM_LOGIN';

const formReducer = (state, action) => {
    if (action.type === FORM_LOGIN) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };

        let updateFormisValid = true;

        for (const key in updatedValidities) {
            updateFormisValid = updateFormisValid && updatedValidities[key];
        }

        return {
            formIsValid: updateFormisValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
}

const LoginScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignUp] = useState(false);
    const data = useSelector(state => state.auth.token);

    const [enableValidation, setEnableValidation] = useState(true);
    const dispatch = useDispatch();

    const isMounted = useRef(null);

    useEffect(() => {
        // executed when component mounted
        isMounted.current = true;
        return () => {
            // executed when unmount
            isMounted.current = false;
        }
    }, []);

    //console.log("Token : " + data);

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    const textHandler = (inputIdentifier, text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        let isValid = false;
        if (text.trim().length > 0 && inputIdentifier === 'email' && reg.test(text) === true) {
            isValid = true;
            //console.log("input : " + inputIdentifier + " - " + reg.test(text));
        } else if (text.trim().length > 0 && inputIdentifier === 'password' && text.length > 5) {
            isValid = true;
            //console.log("input : " + inputIdentifier + " - " + text.length);
        } else {
            //console.log("input : " + inputIdentifier + " - " + reg.test(text));
        }

        dispatchFormState({
            type: FORM_LOGIN,
            value: text,
            isValid: isValid,
            input: inputIdentifier
        });
    }

    const authHandler = async (isSignUp) => {
        let action;
        Keyboard.dismiss();
        if (isSignUp) {
            action = authActions.signup(
                formState.inputValues.email,
                formState.inputValues.password
            );
        } else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            );
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            if (isSignUp) {
                action = authActions.saveUserData();
            } else {
                action = authActions.getUserData();
            }

            await dispatch(action);
            props.navigation.navigate('Dashboard');

        } catch (err) {
            setError(err.message);
            console.log(err.message);
        }
        if (isMounted.current) {
            setIsLoading(false)
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardViewContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={-50}>
            <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
                <View
                    style={{ ...styles.container, ...props.style }}>
                    <Card style={styles.inputContainer}>
                        <InputText
                            style={styles.input}
                            placeholder="Email"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            onChangeText={textHandler.bind(this, 'email')}
                            value={formState.inputValues.email}
                            returnKeyType='next'
                        />
                        {!formState.inputValidities.email && <Text style={styles.textValidation}>Please enter Email</Text>}
                        <InputText
                            style={styles.input}
                            placeholder="Password"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="default"
                            secureTextEntry
                            returnKeyType="go"
                            minLength={5}
                            onChangeText={textHandler.bind(this, 'password')}
                            value={formState.inputValues.password}
                        />
                        {!formState.inputValidities.password && <Text style={styles.textValidation} >Please enter password</Text>}
                        {
                            isLoading ? <ActivityIndicator size='large' style={styles.indicator} color={Colors.primary} /> :
                                <View style={styles.buttonContrainer}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={authHandler.bind(this, false)}>
                                        <Text style={styles.buttonText}> Login </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={authHandler.bind(this, true)} >
                                        <Text style={styles.buttonText}> Signup </Text>
                                    </TouchableOpacity>
                                </View>
                        }
                    </Card>
                </View >
            </ScrollView>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '80%',
        height: 40,
        fontSize: 14,
        color: '#000000',
    },
    buttonContrainer: {
        width: '80%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
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
    inputContainer: {
        width: '80%',
        // maxWidth: '80%',
        maxWidth: '95%',
        minWidth: 300,
        margin: 10,
        alignItems: 'center'
    },
    textValidation: {
        width: '80%',
        color: 'red',
        fontSize: Platform.OS === 'android' ? 12 : 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    indicator: {
        marginTop: 10,
        color: Colors.primary
    }, keyboardViewContainer: {
        width: '100%',
        alignItems: 'center'
    },
});

export default LoginScreen;