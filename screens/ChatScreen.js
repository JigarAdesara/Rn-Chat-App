import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Keyboard,
    Text,
    Button,
    Platform,
    TouchableOpacity,
    Alert,
    FlatList,
    ScrollView,
    YellowBox
} from 'react-native';

import InputText from '../components/InputText';
import Colors from '../constants/colors';

import { useDispatch, useSelector } from 'react-redux';
import * as chatActions from '../store/actions/chat';

import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';

const ChatScreen = props => {

    const [receiverId, setReceiverId] = useState(props.navigation.getParam('receiverId'));
    const [chatId, setChatId] = useState(props.navigation.getParam('chatId'));
    const [recieverEmail, setReceiverEmail] = useState(props.navigation.getParam('title'));

    const [error, setError] = useState();
    const dispatch = useDispatch();
    const [textMessage, setTextMessage] = useState('');

    const currentUserId = useSelector(state => state.auth.userId);
    const currentUserDate = useSelector(state => state.auth.date);

    const messagesList = useSelector(state => state.chat.messages);

    const [isLoading, setIsLoading] = useState(true);
    const [prevDate, setPrevDate] = useState('');
    const [showDate, setShowDate] = useState(false);

    //const chatID = useSelector(state => state.chat.chatId);

    YellowBox.ignoreWarnings([
        'VirtualizedLists should never be nested', // TODO: Remove when fixed
    ])

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }

        const interval = setInterval(() => {
            loadMessages();
        }, 1000);

        return () => {
            clearInterval(interval);
            clearMessages();
        };

    }, [error, loadMessages]);

    const loadMessages = useCallback(async () => {
        setError(null);
        //setIsLoading(true);
        try {
            dispatch(chatActions.getChatMessage(chatId)).then(() => {
                //setIsLoading(false);
            });

            setIsLoading(false);
        } catch (err) {
            setError(err);
        }
    }, [dispatch, setIsLoading, setError]);

    //CLEAR CHAT MESSAGES
    const clearMessages = useCallback(async () => {
        setError(null);
        try {
            dispatch(chatActions.clearMessages());
        } catch (err) {
            setError(err);
        }
    }, [dispatch]);


    //SET SEND MESSAGE TEXT
    const textMessageHandler = (text) => {
        setTextMessage(text);
    }

    const sendMessage = useCallback(async (message) => {
        //console.log("send message called");
        if (message === '') {
            Alert.alert(
                'Alert!',
                'Please enter message',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed'), style: 'default' },
                ],
                { cancelable: false }
            );

        } else {
            let action;
            action = chatActions.sendMessage(message, chatId);

            try {
                await dispatch(action);
                setTextMessage('');

            } catch (err) {
                setError(err);
                console.log(err);
            }
            Keyboard.dismiss();
        }
    }, [dispatch, setError]);

    if (isLoading) {
        return <View style={styles.indicator}><ActivityIndicator size='large' color={Colors.primary} /></View>;
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
            <View style={styles.constainer}>
                <FlatList
                    inverted={-1}
                    style={{ flex: 1 }}
                    data={messagesList}
                    keyExtractor={item => item.msgId}
                    renderItem={itemData => {
                        if (itemData.item.senderId === currentUserId) {
                            return (
                                <View>
                                    <SenderMessage
                                        message={itemData.item.message}
                                        date={itemData.item.date}
                                    />
                                </View>
                            );
                        } else {
                            return (
                                <View>
                                    <ReceiverMessage
                                        message={itemData.item.message}
                                        date={itemData.item.date}
                                        email={recieverEmail} />
                                </View>
                            );
                        }
                    }}
                />
            </View>
            <KeyboardAvoidingView
                style={styles.keyboardViewContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={50}>
                <View style={styles.bottomContainer}>
                    <InputText style={styles.input}
                        onChangeText={textMessageHandler}
                        value={textMessage}
                        placeholder='Enter message'
                        placeholderTextColor='#ffffff'
                    />
                    <TouchableOpacity style={styles.button} onPress={sendMessage.bind(this, textMessage)}>
                        <Text style={{ color: '#ffffff', fontSize: Platform.OS === 'ios' ? 10 : 14 }} > Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScrollView >
    );
}

ChatScreen.navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title', '');
    return {
        headerTitle: title,
        headerTintColor: 'black',
        buttonColor: '#000000',
        backButton: { // android
            color: '#eeeaaa'
        }
    };
};

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
    },
    keyboardViewContainer: {
        width: '100%',
        alignItems: 'center'
    },
    bottomContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: Colors.accent,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15
    },
    button: {
        width: '20%',
        height: 40,
        backgroundColor: Colors.primary,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.26,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black'
    },
    input: {
        width: '75%',
        marginTop: 5
    },
    indicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ChatScreen;