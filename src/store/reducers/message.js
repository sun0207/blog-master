import * as types from "../types";
import messageStore from './../stores/message';

const initState = {
	messageContent: '',
	messageState: false,
};
export function message(state = initState,action){
    switch(action.type){
        case types.MESSAGE_SAVE:
            messageStore.addNewItemHandler(action.payload);
            messageStore.emitChange();
            return {
                ...state,
                messageContent:state.messageContent,
                messageState:true
            }
        default:
            return {
                ...state,
                messageContent:'',
                messageState:false
            }
    }
}