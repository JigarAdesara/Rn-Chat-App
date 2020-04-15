import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, Image, AsyncStorage, Alert } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { NavigationActions, NavigationEvents } from 'react-navigation';

import * as usersActions from '../store/actions/users';
import * as authAction from '../store/actions/auth';
import * as chatAction from '../store/actions/chat';

import Colors from '../constants/colors';

import UserItem from '../components/UserItem';

import moment from 'moment';

const MainScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const emailId = useSelector(state => state.auth.emailId);
    const token = useSelector(state => state.auth.token);
    const currentUserId = useSelector(state => state.auth.userId);
    const currentUserDate = useSelector(state => state.auth.date);

    const userList = useSelector(state => state.users.userData);
    const userDataLength = useSelector(state => state.users.userData.length);

    useEffect(() => {
        loadUserData();
    }, [dispatch]);


    const loadUserData = async () => {
        setIsLoading(true);
        dispatch(usersActions.getUserList()).then(() => { });

        // for (let i = 0; i < userDataLength; i++) {
        //     //          console.log("dat : " + userList[i].userId);
        //     let chatId = '';
        //     if (userList[i].date > currentUserDate) {
        //         chatId = userList[i].userId + "-" + currentUserId;
        //     } else {
        //         chatId = currentUserId + "-" + userList[i].userId;
        //     }
        //     dispatch(usersActions.getLastMessage(chatId, userList[i].userId)).then(() => { });
        // }
        setIsLoading(false);
    };

    useEffect(() => {
        props.navigation.setParams({ logout: logoutHandler });
    }, [logoutCall]);

    const logoutHandler = useCallback(async () => {
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
                    text: "Yes", onPress: () => {
                        dispatch(authAction.logout());
                        props.navigation.dispatch(
                            NavigationActions.navigate({
                                routeName: "Login"
                            })
                        );
                    }
                }
            ],
            { cancelable: false }
        );

    }, [dispatch]);

    const moveTo = (emailId, receiverId, receiverDate) => {

        let chatId = '';
        if (receiverDate > currentUserDate) {
            chatId = receiverId + "-" + currentUserId;
        } else {
            chatId = currentUserId + "-" + receiverId;
        }

        // console.log(props.nevigation);
        props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: "Chat", params: {
                    title: emailId,
                    receiverId: receiverId,
                    chatId: chatId
                }
            })
        )
    };

    if (isLoading) {
        return <View style={styles.indicator}><ActivityIndicator size='large' color={Colors.primary} /></View>;
    }

    return (
        <View style={styles.mainContainer}>
            <NavigationEvents onDidFocus={loadUserData} />
            <FlatList
                data={userList}
                keyExtractor={item => item.userId}
                renderItem={itemData => {
                    if (itemData.item.userId !== currentUserId) {
                        return (
                            <UserItem email={itemData.item.emailId}
                                onItemClick={() => { moveTo(itemData.item.emailId, itemData.item.userId, itemData.item.date) }}
                            />
                        );
                    }
                }}
            />
            <View style={styles.constainer}>
                <Text> Current User Email Id : {emailId} </Text>
                {/* <Text> Current Date : {moment(currentUserDate).format('MMMM Do YYYY, hh:mm')} </Text> */}
            </View>
        </View >);
};

const logoutCall = () => {
    AsyncStorage.clear();
};

MainScreen.navigationOptions = navData => {

    const logoutFn = navData.navigation.getParam('logout');

    return {
        headerTitle: 'RN Chat App',
        headerRight: () => (
            <TouchableOpacity onPress={logoutFn}
            //navData.navigation.navigate('Setting')
            >
                <View style={{ flexDirection: 'row' }}>
                    {/*Donute Button Image */}
                    <Image
                        source={require('../assets/logout.png')}
                        style={{ width: 20, height: 20, margin: 15 }}
                    />
                </View>
            </TouchableOpacity >
        )
    };
};



// MainScreen.nevigationOptions = ({ nevigation }) => {
//     return {
//         headerTitle: 'RN Chat App1',
//         headerRight: (
//             <View style={{ flexDirection: 'row' }}>
//                 <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
//                     {/*Donute Button Image */}
//                     <Image
//                         source={require('../assets/logout.png')}
//                         style={{ width: 25, height: 25, marginLeft: 5 }}
//                     />
//                 </TouchableOpacity>
//             </View>
//         )
//     };
// };

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    constainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    indicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MainScreen;