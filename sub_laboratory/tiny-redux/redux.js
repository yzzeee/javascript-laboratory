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



function randomByte(byte) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwsyz1234567890';
    let res = '';
    for (let i = 0; i < byte; i++) {
        res += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return res;
}

let data = randomByte(128000);

for(let i = 0; i < 40000; i++) {
    // save(data)
}

function createModels(modelCount, byteLength) {

    for(let i = 0; i < modelCount; i++) {
        models.push(mongoose.model(COLLECTION_NAME, new mongoose.Schema({
            txId: Math.random().toString(36).substr(2,5),
            message: randomByte(byteLength)
        })));
    }
    return models;
}

models.forEach(model => model.save());



function createModels(modelCount, byteLength) {
    const data = Array(modelCount);
    
    for(let i=0; i < modelCount; i++) {
        data[i] = randomByte(byteLength);
    }
    
    const models = [];
    
    for(let i = 0; i < modelCount; i++) {
        models.push(new Object({
            txId: Math.random().toString(36).substr(2,5),
            message: data[i]
        }));
    }
    return models;
}

models.forEach(model => model.save());

