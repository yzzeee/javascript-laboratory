import { createStore } from './redux-sync.js';

const COUNTER = 'count'

function reducer(state, action) {
    if (action.type === COUNTER) {
        return {...state, counter: action.payload.counter};
    }
    
    return state;
}

function listener() {
    console.log(store.getState());
}

function actionCreator(type, payload) {
    return { type, payload };
}

const store = createStore(reducer);

store.subscribe(listener);

store.dispatch(actionCreator(COUNTER, {counter: 5}));

function counter(data) {
    store.dispatch(actionCreator(COUNTER, data));
}

counter({counter: 7});
