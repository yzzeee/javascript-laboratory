# REDUX 만들어보며 이해하기
> The RED : 김민태 React와 Redux로 구현하는 아키텍쳐와 리스크 관리

최초의 전역스토어(store)를 가지고 있다.
컴포넌트는 자신의 상태를 알고 전역 스토어에서 필요한 상태를 가지고 온다.

리덕스의 핵심적인 부분은 store!
각각의 컴포넌트들은 전역 스토어에서 상태를 가져오고 보고 할 수 있는데, 수정 시에 직접 수정을 하면
에러발생 시 디버깅 하기가 어렵고 관리가 어렵기 때문에 어떠한 트리거가 발생되길 기다렸다가
해당 트리거 발생 시 값을 변경하는 것은 한 곳에서 관리하도록 한다.

그런데 리덕스 입장에서는 상태를 어떻게 변경해야할 지는 알 수 없다.
그 상태에 대한 디자인은 바꾸고 싶은 앱이 함수를 전달하여 수정 시점에 리덕스가 호출해주는 형태로 구현한다.

---
1. 리덕스 기본

```javascript
export function createStore(updater) {
    let state; // 초기 상태는 primitive type이므로 reducer가 반환한 값을 return 해서 state에 다시 넣어주어야함
    
    function doUpdate(data) { // state 변경을 앱이 원하는 시점에서 실행할 수 있도록 반환하는 state 변경 함수이다.
        state = updater(state, data);
    }
    
    function getState() {
        return state;
    }
    
    return {
        doUpdate,
        getState // state를 바로 반환할 경우 값을 직접 참조하게 되므로 getter를 반환한다.
    };
}
```

```javascript
import { createStore } from './redux-basic.js';

// 앱의 상태에 따라 원하는 시점에 스토어의 상태를 바꿔줄 함수이다.
function updater(state, data) {
    state = data;
    return state; // 스토어의 처음 state는 primitive type이므로 return을 한 값을 다시 스토어의 state로 바꿔야한다.
}

const store = createStore(updater); // 스토어를 생성하면서 스토어의 상태를 바꿔줄 수 있는 updater를 전달한다.

store.doUpdate({ counter : 1 });
```

updater => reducer
doUpdate => dispatch
date => action : 주로 { type: 'blabla', payload: 'blabla' } 형태의 컨벤션을 가지고 있다.

---
2. 리덕스 형태로 변경
```javascript
export function createStore(reducer) {
    let state; // 초기 상태는 primitive type이므로 reducer가 반환한 값을 return 해서 state에 다시 넣어주어야함
    
    function dispatch(data) {
        state = reducer(state, data);
    }
    
    function getState() {
        return state;
    }
    
    return {
        dispatch,
        getState
    };
}
```

```javascript
import { createStore } from './redux.js';

function reducer(state, action) {
    if (action.type === 'count') {
        return {...state, counter: action.payload.counter};
    }
    
    return state;
}

const store = createStore(reducer);

store.dispatch({
    type: 'count',
    payload: {
        counter : 3
    }
});

console.log(store.getState());
```

스토어는 리덕스가 제공하는 도구들을 모아놓은 일종의 도구 박스 같다...
상태를 바꾸기위해서 dispatch하기위한 dispatch 함수, store 안의 상태를 갖기위한 getState 함수를 가지고 있다.
---
여기까지 보면 store에 dispatch 후에 getState를 하는 시점을 컴포넌트가 알고 있어서 상태를 가져올 수 있다.
그런데 스토어는 다른 앱도 함께 사용하는 전역 객체이라 다른 컴포넌트가 dispatch 했을 때는 어떻게 알 수 있을까.
이는 마치 우리가 이벤트 시스템에서 어떤 버튼에 클릭 이벤트 핸들러를 직접 달아주는 것과 비슷한데
언제 사용자가 버튼을 클릭할 지 알 수 없기 때문이다.

이러한 패턴을 소프트웨어 아키텍쳐에서 pub sub 패턴이라고 한다. 
사건이 발생하면 구독자에게 전달해주는 형태의 패턴이다.

따라서 위의 console.log(store.getState()); 부분을 dispatch 된 후 상태가 바뀌었을 때 실행 되도록 변경해본다.

dispatch는 action을 전달하는데, 간단하게 actionCreator 함수를 작성해서 중복을 제거한다.
action type도 정의해서 중복을 줄인다.

```javascript
import { createStore } from './redux.js';

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
```
---
리덕스 자체만으로는 비동기 작업을 처리 할 수 없다.
```javascript
function reducer(state, action) {
    if (action.type === COUNTER) {
        return {...state, counter: action.payload.counter};
    }
    
    if (action.type === FETCH) {
        fetch('').then(response => { // 리덕스 
            response;
        });
    }
    
    return state;
}
```
reducer에 FETCH 액션을 처리하는 코드를 넣어 주었다 하더라도 상태값을 가져오는 로직은 비동기 적으로 이루어지지 않는다.
따라서 리듀서의 동기적인 흐름이외에 여러가지 기능을 할수 있도록 리덕스에서 바깥쪽을 노출하고 있는 아키텍쳐인 미들웨어를 활용한다.
