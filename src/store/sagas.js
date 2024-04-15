import { all, fork } from "redux-saga/effects"


import LayoutSaga from "./layout/saga"


export default function* rootSaga() {
  yield all([
    //public
   // AccountSaga(),
   // fork(AuthSaga),
    //ProfileSaga(),
    //ForgetSaga(),
    LayoutSaga(),
    //fork(calendarSaga),
   // fork(chatSaga),
   // fork(tasksSaga),
    //fork(tasksSaga)
  ])
}
