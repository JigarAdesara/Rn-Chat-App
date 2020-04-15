import Message from "../../model/message";

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const CREATE_CHAT = 'CREATE_CHAT';
export const GET_MESSAGES = 'GET_MESSAGES';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';


export const clearMessages = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: CLEAR_MESSAGES
        });
    }
};

export const sendMessage = (message, chatId) => {
    return async (dispatch, getState) => {

        const userId = getState().auth.userId;
        const date = new Date();

        const response = await fetch(
            `https://rn-chat-app-204ff.firebaseio.com/chatroom/${chatId}.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    senderId: userId,
                    date: date
                })
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();
        //console.log('Send  : ' + JSON.stringify(resData.name));

        const id = resData.name;

        dispatch({
            type: SEND_MESSAGE,
            msgId: resData.name,
            message: message,
            senderId: userId,
            date: date
        });
    };
};


export const getChatMessage = (chatId) => {
    return async (dispatch, getState) => {
        try {

            const url = `https://rn-chat-app-204ff.firebaseio.com/chatroom/${chatId}.json`;

            //console.log(url);
            fetch(url, {
                method: 'GET'
            })
                .then((response) => response.json())
                //If response is in json then in success
                .then((responseJson) => {
                    //Success 
                    const resData = responseJson;
                    //console.log('Message Data : ' + JSON.stringify(resData));

                    const loadMessages = [];

                    for (const key in resData) {
                        loadMessages.push(new Message(
                            key,
                            resData[key].message,
                            resData[key].senderId,
                            resData[key].date
                        ));
                    }

                    dispatch({
                        type: GET_MESSAGES,
                        messages: loadMessages
                    });
                })
                //If response is not in json then in error
                .catch((error) => {
                    //Error 
                    //console.error(error);
                    throw new Error('Something went wron!');
                });

        } catch (err) {
            throw err;
        }
    };
};



export const addUserChat = (receiverId) => {
    return async (dispatch, getState) => {

        const userId = getState().auth.userId;
        const chatId = userId + ' - ' + receiverId;

        const response = await fetch(
            `https://rn-chat-app-204ff.firebaseio.com/userChat/${userId}/.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: userId,
                    receiverId: receiverId,
                    chatId: chatId
                })
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = response.json();
        // console.log('userChat  : ' + JSON.stringify(resData));
        dispatch({
            type: CREATE_CHAT,
            chatId: resData.chatId,
            senderId: resData.senderId,
            receiverId: resData.receiverId
        });
    };
};


