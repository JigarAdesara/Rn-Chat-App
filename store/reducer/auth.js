import { AUTHENTICATE, LOGOUT, SIGNUP, USER_DATA } from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
    emailId: null,
    date: null,
    localId: null,
    username: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                emailId: action.emailId
            };
        case LOGOUT:
            return initialState;
        // case SIGNUP:
        //     return {
        //         token: action.token,
        //         userId: action.userId,
        //         emailId: action.emailId
        //     };
        case USER_DATA:
            return {
                token: action.token,
                emailId: action.emailId,
                userId: action.userId,
                date: action.date,
                localId: action.localId,
                username: action.username
            };
        default:
            return state;
    }
};
