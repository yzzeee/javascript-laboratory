function randomByte(byte) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let res = '';
    for (let i = 0; i < byte; i++) {
        res += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return res;
}

function createModels(modelCount, byteLength) {
    const models = [];
    for (let i = 0; i < modelCount; i++) {
        const txId = Math.random().toString(36).substr(2, 5);
        
        models.push(new Object({
            txId,
            message: randomByte(byteLength),
            save: async () => { return new Promise((resolve) => {
                setTimeout(() => resolve(txId), 1000);
            })}
        }));
    }
    return models;
}

function createTargetModels(models, limit) {
    const targetList = [];
    for(let i = 0; i < limit; i++){
        if(models.length) {
            targetList.push(models.shift());
        }
    }
    return targetList;
}

function tryInsert(start, result, models, limit) {
    let initModelLength = models.length;
    (function recur() {
        let done = 0;
        const targetModels = createTargetModels(models, limit);
        console.log('init', initModelLength, result, result.length, );
        if(initModelLength === result.length) {
            console.log(Date.now() - parseInt(start));
        }
        targetModels.forEach(async (model) => {
            await model.save();
            done++;
            result.push(model.txId);
            console.log(done, limit, targetModels.length)
            if(done === limit || targetModels.length < limit) {
                recur(models, limit);
            }
        });
    })();
}