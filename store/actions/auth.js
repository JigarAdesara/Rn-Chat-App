import { AsyncStorage, Alert } from 'react-native';
import { UPDATE_USER } from './users';

export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const USER_DATA = 'USER_DATA';


export const authenticate = (token, userId, emailId, date, localId, username) => {
    return dispatch => {
        dispatch({
            type: USER_DATA,
            emailId: emailId,
            userId: userId,
            date: date,
            token: token,
            localId: localId,
            usernmae: username
        });
    };
};

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDf1oNQZRenehRGTsc7JkTAZBzVZCc2bww',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            } else if (errorId === 'INVALID_EMAIL') {
                message = 'This email id is not valid!';
            }
            Alert.alert(
                'Sign up',
                message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed'), style: 'default' },
                ],
                { cancelable: false }
            );

            throw new Error(errorId);
        }

        const resData = await response.json();

        //console.log("Sign UP : " + JSON.stringify(resData));
        dispatch({
            type: AUTHENTICATE,
            token: resData.idToken,
            userId: resData.localId,
            emailId: email
        });
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDf1oNQZRenehRGTsc7JkTAZBzVZCc2bww',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!';
            }
            Alert.alert(
                'Login',
                message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed'), style: 'default' },
                ],
                { cancelable: false }
            );

            throw new Error(message);
        }

        const resData = await response.json();
        //console.log("Log in  : " + resData.localIdc);

        dispatch({
            type: AUTHENTICATE,
            token: resData.idToken,
            userId: resData.localId,
            emailId: email
        });

        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        //saveDataToStorage(resData.idToken, resData.localId, );
    };
};

export const saveUserData = () => {
    return async (dispatch, getState) => {

        const userId = getState().auth.userId;
        const emailId = getState().auth.emailId;
        const token = getState().auth.token;
        const date = new Date();

        //  console.log("User Id : " + userId + "\n" + "Email Id : " + emailId);

        const response = await fetch(
            `https://rn-chat-app-204ff.firebaseio.com/users/${userId}.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailId: emailId,
                    userId: userId,
                    date: date
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;

            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            } else if (errorId === 'INVALID_EMAIL') {
                message = 'This email id is not valid!';
            }
            Alert.alert(
                'Save Data',
                message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed'), style: 'default' },
                ],
                { cancelable: false }
            );

            throw new Error(errorId);
        }

        const resData = await response.json();
        console.log("Store Data : " + JSON.stringify(resData));


        // dispatch({
        //     type: USER_DATA,
        //     emailId: emailId,
        //     userId: userId,
        //     date: date,
        //     token: token
        // });

        dispatch(authenticate(token, userId, emailId, date, resData.name));

        saveDataToStorage(token, userId, emailId, date, resData.name, '');
    };
};


export const getUserData = () => {
    return async (dispatch, getState) => {

        const userId = getState().auth.userId;
        const token = getState().auth.token;

        //console.log("User Id : " + userId + "\n" + "Email Id : " + emailId);

        const response = await fetch(
            `https://rn-chat-app-204ff.firebaseio.com/users/${userId}.json`
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;

            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            } else if (errorId === 'INVALID_EMAIL') {
                message = 'This email id is not valid!';
            }
            Alert.alert(
                'Save Data',
                message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed'), style: 'default' },
                ],
                { cancelable: false }
            );

            throw new Error(errorId);
        }

        const resData = await response.json();

        //console.log("Get Data : " + JSON.stringify(resData));

        Object.entries(resData).map(([key1, value1]) => {
            ///console.log("Key : " + key1)
            let username = 'test';
            if (key1 === 'username') {
                username = resData[key1].username;
            }

            dispatch(authenticate(token, resData[key1].userId, resData[key1].emailId, resData[key1].date, key1, username));

            saveDataToStorage(
                token,
                resData[key1].userId,
                resData[key1].emailId,
                resData[key1].date,
                key1,
                username
            );
        });
    };
};


export const updateUser = (username) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const localId = getState().auth.localId;
        const date = getState().auth.date;
        const emailId = getState().auth.emailId;
        const token = getState().auth.token;

        const response = await fetch(
            `https://rn-chat-app-204ff.firebaseio.com/users/${userId}/${localId}.json`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: date,
                    emailId: emailId,
                    userId: userId,
                    username: username
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;

            Alert.alert(
                'Error!',
                errorId,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed'), style: 'default' },
                ],
                { cancelable: false }
            );

            throw new Error(errorId);
        }

        const resData = await response.json();
        console.log("Update user : " + JSON.stringify(resData));

        dispatch(
            {
                type: UPDATE_USER,
                userId: userId,
                emailId: emailId,
                date: date,
                localId: localId,
                token: token
            }
        );

        saveDataToStorage(token, userId, emailId, date, localId, username);
    }
};

export const logout = () => {
    //clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const saveDataToStorage = (token, userId, emailId, date, localId, username) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token: token,
            userId: userId,
            emailId: emailId,
            date: date,
            localId: localId,
            username: username
        })
    );
};
