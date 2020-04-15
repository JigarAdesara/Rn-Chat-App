import { SET_USERS, UPDATE_USER } from '../actions/users';
import User from '../../model/user';

const initialState = {
    userData: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS:
            return {
                userData: action.userData
            };

        case UPDATE_USER:
            const userIndex = state.userData.findIndex(
                user => user.userId === action.userId
            );
            //console.log("Index :" + userIndex);

            const updatedUser = new User(
                state.userData[userIndex].userId,
                state.userData[userIndex].emailId,
                state.userData[userIndex].date,
            );
            const updatedUsers = [...state.userData];
            updatedUsers[userIndex] = updatedUser;

            return {
                ...state,
                userData: updatedUsers
            };
    }

    return state;
}