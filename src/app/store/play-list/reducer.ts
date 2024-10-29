import { Action } from "@ngrx/store";

export const PLAY = "PLAY";
export const ADD_TO_PLAY_LIST = "ADD_TO_PLAY_LIST";
export const REMOVE_FROM_PLAY_LIST = "REMOVE_FROM_PLAY_LIST";

export interface State {
  playlist: Array<File>;
  current: File | null;
}
export interface AppAction extends Action {
  payload: File;
}

const initialState: State = {
  playlist: [
    {
      lastModified: 1730144458693,
      name: "SampleVideo_1280x720_1mb.mp4",
      size: 1055736,
      type: "video/mp4",
      webkitRelativePath: "Desktop/SampleVideo_1280x720_1mb.mp4",
    } as File,
    {
      lastModified: 1730144458693,
      name: "SampleVideo_1280x720_1mb.mp4",
      size: 1055736,
      type: "video/mp4",
      webkitRelativePath: "Desktop/sub/SampleVideo_1280x720_1mb.mp4",
    } as File,
    {
      lastModified: 1730144458693,
      name: "SampleVideo_1280x720_1mb.mp4",
      size: 1055736,
      type: "video/mp4",
      webkitRelativePath: "Desktop/sub/sub-sub/SampleVideo_1280x720_1mb.mp4",
    } as File,
  ],
  current: null,
};

export function playListReducer(
  state = initialState,
  action: AppAction
): State {
  switch (action.type) {
    case ADD_TO_PLAY_LIST:
      return { ...state, playlist: [...state.playlist, action.payload] };
    case REMOVE_FROM_PLAY_LIST:
      return {
        ...state,
        playlist: state.playlist.filter((x) => x.path !== action.payload.path),
      };
    case PLAY:
      return {
        ...state,
        current: action.payload,
      };

    default:
      return state;
  }
}
