const COLLECTION_NAME = 'name';
const mongoose: any = { model: (name: any, object: any) => {}};

function init(modelCount: number, byteLength: number, limit: number) {
    function randomByte(byte: number) {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        let res = '';
        for (let i = 0; i < byte; i++) {
            res += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return res;
    }

    function createModels(modelCount: number, byteLength: number): any[] {
        const models = [];
        for (let i = 0; i < modelCount; i++) {
            const txId = Math.random().toString(36).substr(2, 5);

            models.push(mongoose.model(COLLECTION_NAME, new mongoose.Schema({
                txId,
                message:randomByte(byteLength)
            })));
        }
        return models;
    }

     function createTargetModels(models: any[], limit = 1  ) {
        const targetList = [];
        for(let i = 0; i < limit; i++){
            if(models && models.length) {
                targetList.push(models.shift());
            }
        }
        return targetList;
    }

    function tryInsert(start = Date.now(), result: boolean[], models: object[], limit = 1) {
        let initModelLength = models.length;
        (function recur(models = [], limit = 1) {
            let done = 0;
            const targetModels = createTargetModels(models, limit);
            if(initModelLength === result.length) {
                console.log(Date.now() - start);
            }
            targetModels.forEach(async (model) => {
                await model.save();
                done++;
                result.push(true);
                if(done === limit || targetModels.length < limit) {
                    recur(models, limit);
                }
            });
        })();
    }

    const now = Date.now();
    const result: boolean[] = [];
    const models = createModels(modelCount, byteLength);

    tryInsert(now, result, models, limit);
}

