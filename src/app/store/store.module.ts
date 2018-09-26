import { NgModule } from '@angular/core';
import { StoreModule,MetaReducer,ActionReducer  } from "@ngrx/store";
import { AppState } from './state';
import { AppConfig  } from "../../environments/environment";
import { AppAction } from '../helpers';
import { localReducer } from './Local/reducer';

function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
      console.log("%c -----------------------------------",'color:green')

      console.log("%c dispatching",'background: #222; color: #bada55')
      console.log(action)

      console.log("%c previous state",'background: #222; color: #bada55')
      console.log(state)

      

      let newState = reducer(state, action)

      console.log("%c new state",'background: #222; color: #bada55')
      console.log(newState)
      console.log("%c -----------------------------------",'color:green')
      return newState;
  };
}



export const metaReducers: MetaReducer<AppState>[] = AppConfig.production?[]:[debug];
@NgModule({
  imports: [
    StoreModule.forRoot<AppState, AppAction>({
      LOCAL:localReducer
  }, { metaReducers })
  ]
})
export class AppStoreModule { }
