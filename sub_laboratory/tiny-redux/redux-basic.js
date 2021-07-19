export function createStore(updater) {
    let state; // 초기 상태는 primitive type이므로 reducer가 반환한 값을 return 해서 state에 다시 넣어주어야함
    
    function doUpdate(data) {
        state = updater(state, data);
    }
    
    function getState() {
        return state;
    }
    
    return {
        doUpdate,
        getState
    };
}