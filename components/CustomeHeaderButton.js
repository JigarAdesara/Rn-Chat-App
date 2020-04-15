import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Colors from '../constants/colors';

const CustomeHeaderButton = props => {

    return (
        <HeaderButtons
            {...props}
            IconComponent={Ionicons}
            iconSize={23}
            color='#ffffff'
        />
    );
};

export default CustomeHeaderButton;
