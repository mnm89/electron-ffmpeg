import { ChildrenTree, AppAction } from "../../helpers";
export const CURRENT_TREE="CURRENT_TREE"
export const CURRENT_PLAY="CURRENT_PLAY"
export const ADD_TO_LOCAL_PLAY_LIST="ADD_TO_LOCAL_PLAY_LIST"
export const REMOVE_FROM_LOCAL_PLAY_LIST="REMOVE_FROM_LOCAL_PLAY_LIST"

export interface LocalState {
        playlist:Array<ChildrenTree> 
        tree:ChildrenTree
        currentplaying:ChildrenTree
        toggle_playlist:boolean
};

const initialState: LocalState = {
        playlist:[],
        tree:null,
        currentplaying:null,
        toggle_playlist:false
};

export function localReducer(state = initialState, action: AppAction ): LocalState {
    switch (action.type) {
        case CURRENT_TREE:
        localStorage.setItem('LAST_FOLDER',JSON.stringify(action.payload)) 
        return {  ...state,tree:action.payload };
        case ADD_TO_LOCAL_PLAY_LIST:
        state.playlist.push(action.payload)
        return {...state,toggle_playlist:true}
        case REMOVE_FROM_LOCAL_PLAY_LIST:
        var p=state.playlist.filter(x=>x.path!==action.payload.path)
        return {...state, playlist:p,toggle_playlist:p.length>0}

        default: 
            return state;
        
    }
}