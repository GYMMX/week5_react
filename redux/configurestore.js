import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/Image";

//history객체생성
export const history = createBrowserHistory();

//리덕스에 히스토리 넣어줌_우리가 만든 히스토리와 라우터가 연결됨
const rootReducer = combineReducers({
  user: User,
  post: Post,
  image: Image,
  router: connectRouter(history),
});

//배열에 내가 사용할 미들웨어를 다 넣는 것
//액션을 반환하기전 리듀서 실행 전 청크를 써서 단계를 쓸 수 있음_비동기작업들
const middlewares = [thunk.withExtraArgument({ history: history })];

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
//니가 만약 개발환경이라면 logger을 가지고 와
//import가 아닌 require로 가져오는 이유, 개발 환경일 때만 쓸거니깐 productio에선 아예 안쓸거니깐!
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

//dev tools가 편하다고 하심.. 안써도 된다고 하셧지만.. 편해서 중독됏다는데 뭔지 모르겟음
//자바스크립트는 브라우저가 아닐 때도 돌아감
const composeEnhancers =
  //따라서 브라우저일 때만 돌아가라고 잇는 구문
  //&&은 깔려있으면 열어주라는 말
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

//미들웨어를 묶는 것
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

//미들웨어랑 루트를 엮어 스토어를 만드는 것
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
