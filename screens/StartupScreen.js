import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { AsyncStorage, View, ActivityIndicator, StyleSheet } from 'react-native';

import * as authActions from '../store/actions/auth';

import Color from '../constants/colors';

const StartupScreen = props => {

    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            try {
                //console.log(props);
                const userData = await AsyncStorage.getItem('userData');
                if (!userData && userData === null) {
                    props.navigation.dispatch(
                        NavigationActions.navigate({
                            routeName: "Login"
                        })
                    );

                    return;
                }

                const fetchData = JSON.parse(userData);
                const { token, userId, emailId, date } = fetchData;

                if (token === '' || token === null) {
                    props.navigation.dispatch(
                        NavigationActions.navigate({
                            routeName: "Login"
                        })
                    )
                    return;
                }

                props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: "Dashboard"
                    })
                )
                dispatch(authActions.authenticate(token, userId, emailId, date));

            } catch (err) {
                console.log(err);
            }
        };

        tryLogin();

    }, [dispatch]);

    return (<View style={styles.container}>
        <ActivityIndicator size='large' color={Color.primary} />
    </View>);
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;