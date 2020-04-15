import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { View, TouchableOpacity, Image } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import MainScreen from '../screens/MainScreen'
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import StartupScreen from '../screens/StartupScreen';
import SettingScreen from '../screens/SettingScreen';

import CustomeHeaderButton from '../components/CustomeHeaderButton';
import Colors from '../constants/colors';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Colors.primary,
    }
};

const MainNevigator = createStackNavigator(
    {
        Main: {
            screen: MainScreen,
            // nevigationOptions: ({ nevigation }) => {
            //     return {
            //         headerTitle: 'Rn Chat App',
            //         headerRight: (
            //             <View style={{ flexDirection: 'row' }}>
            //                 <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
            //                     <Image
            //                         source={require('../assets/logout.png')}
            //                         style={{ width: 25, height: 25, marginLeft: 5 }}
            //                     />
            //                 </TouchableOpacity>
            //             </View>
            //         )
            //     }
            // }
        },
        Chat: ChatScreen,
        Setting: SettingScreen
    },
    {
        defaultNavigationOptions: defaultNavOptions
    });

const LoginNevigator = createSwitchNavigator(
    {
        Start: StartupScreen,
        Login: LoginScreen,
        Dashboard: MainNevigator
    },
    {
        headerMode: 'none'
    });


export default createAppContainer(LoginNevigator);