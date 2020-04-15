import { SEND_MESSAGE, GET_MESSAGES, CLEAR_MESSAGES } from '../actions/chat';
import Message from '../../model/message';

const initialState = {
    messages: [],
    lastMessage: '',
    lastMsgDate: '',
    lastMsgId: ''
};

export default (state = initialState, action) => {

    switch (action.type) {
        case SEND_MESSAGE:
            const newMessage = new Message(
                action.msgId,
                action.message,
                action.senderId,
                action.date
            );
            return {
                ...state,
                messages: state.messages.concat(newMessage)
            };

        case GET_MESSAGES:
            return {
                messages: action.messages.reverse()
            };
        case CLEAR_MESSAGES:
            return { initialState };

        default:
            return state;
    }
};