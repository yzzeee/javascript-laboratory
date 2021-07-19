export function createStore(reducer) {
    let state; // 초기 상태는 primitive type이므로 reducer가 반환한 값을 return 해서 state에 다시 넣어주어야함
    const handler = [];
    
    function dispatch(data) {
        state = reducer(state, data);
        handler.forEach((listener) => {
            listener();
        })
    }
    
    function getState() {
        return state;
    }
    
    function subscribe(listener) {
        handler.push(listener);
    }
    
    return {
        dispatch,
        getState,
        subscribe
    };
}