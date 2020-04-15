import User from '../../model/user';

export const SET_USERS = 'SET_USERS';
export const UPDATE_USER = 'UPDATE_USER';
export const GET_LAST_MESSAGE = 'GET_LAST_MESSAGE';

export const getUserList = () => {
    return async (dispatch, getState) => {
        // const currentUserId = getState().auth.userId;
        const currentUserDate = getState().auth.date;

        //console.log("aa : " + currentUserId);

        try {
            const response = await fetch(`https://rn-chat-app-204ff.firebaseio.com/users.json`);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const loadUserList = [];

            Object.entries(resData).map(([key1, value1]) => {
                // console.log("Key : " + key1);
                Object.entries(value1).map(([key2, value2]) => {
                    // console.log("Key : " + key2);
                    //  console.log("Data : " + JSON.stringify(value2));
                    loadUserList.push(
                        new User(
                            value1[key2].userId,
                            value1[key2].emailId,
                            value1[key2].date,
                        )
                    );
                });
            });


            // loadUserList.map((item, key) => {
            //     console.log("User : " + key);
            //     console.log(item.emailId);
            //     console.log(item.userId);
            // });

            dispatch({ type: SET_USERS, userData: loadUserList });

        } catch (err) {
            throw err;
        }
    };
};

// export const getLastMessage = (chatId, receiverId) => {
//     return async (dispatch, getState) => {
//         try {
//             const url = `https://rn-chat-app-204ff.firebaseio.com/chatroom/${chatId}.json`;
//             //console.log("last msg : " + url);
//             fetch(url, {
//                 method: 'GET'
//             })
//                 .then((response) => response.json())
//                 .then((resData) => {
//                     if (resData !== null) {
//                         //console.log('Last Message Data : ' + JSON.stringify(resData));
//                         //const loadMessages = [];
//                         const lastKey = Object.keys(resData).sort().reverse()[0];

//                         //console.log(lastKey + " => " + resData[lastKey].message + " -> " + resData[lastKey].date);
//                         dispatch({
//                             type: UPDATE_USER,
//                             userId: receiverId,
//                             lastMessage: resData[lastKey].message,
//                             lastMsgDate: resData[lastKey].date,
//                             lastMsgId: lastKey
//                         });
//                     }
//                 })
//                 //If response is not in json then in error
//                 .catch((error) => {
//                     //Error 
//                     console.error(error);
//                     throw new Error('Something went wron!');
//                 });

//         } catch (err) {
//             throw err;
//         }
//     };
// };
