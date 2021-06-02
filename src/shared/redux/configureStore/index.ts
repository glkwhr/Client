import thunk from 'redux-thunk';
import {
  createStore,
  applyMiddleware,
  StoreEnhancer,
  combineReducers,
} from 'redux';
// import { createLogger } from 'redux-logger';
import config from '../../project.config';
import { getReducers } from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import actionCreators from '../actions';
import { memoryLogger } from './memory-logger';
import { initStoreHelper } from './helper';
import type {
  TRPGStore,
  TRPGState,
  TRPGMiddleware,
} from '@redux/types/__all__';
import { IS_DEVELOPER } from '@shared/utils/consts';

console.log('当前环境:', config.environment);
console.log('当前平台:', config.platform);

const middlewares: TRPGMiddleware[] = [thunk];
middlewares.push(memoryLogger);

// if (config.environment === 'development' && config.platform !== 'app') {
//   // 移动端不启用logger. 因为远程js调试会非常卡
//   const logger = createLogger({
//     level: 'info',
//     logger: console,
//     collapsed: true,
//   });
//   middlewares.push(logger);
// }

interface StoreOptions {
  initialState?: TRPGState;
  additionReducer?: { [name: string]: (state: any, action: any) => any };
  additionMiddleware?: TRPGMiddleware[];
}
const defaultStoreOptions: StoreOptions = {
  initialState: undefined,
  additionReducer: {},
  additionMiddleware: [],
};

function configureStore(
  options: StoreOptions = defaultStoreOptions
): TRPGStore {
  const initialState = options.initialState;

  if (Array.isArray(options.additionMiddleware)) {
    middlewares.push(...options.additionMiddleware); // 增加额外中间件
  }

  let enhancer: StoreEnhancer<any> = applyMiddleware(...middlewares);
  if (
    config.environment === 'development' ||
    localStorage.getItem(IS_DEVELOPER) === 'true'
  ) {
    // 如果为开发环境或者为开发者
    // 增加redux-devtools-extension
    enhancer = composeWithDevTools({
      actionCreators,
    })(applyMiddleware(...middlewares));
  }

  const reducers = getReducers(options.additionReducer);
  const store = createStore(combineReducers(reducers), initialState, enhancer);

  initStoreHelper(store, reducers); // 注册Helper

  return store;
}

export default configureStore;
