export function applyActionAndGetNextSession(schema, state, action) {
    const nextState = schema.session(state, action).state;
    return schema.session(nextState);
}

export class ReduxORMAdapter {
    constructor(session) {
        this.session = session;
    }

    build(modelName, props) {
        return this.session[modelName].create(props);
    }

    save(model, Model) {
        return Promise.resolve();
    }

    get(doc, attr) {
        console.log('***************get', doc, attr);
        return doc[attr];
    }
    //
    // set(props, doc) {
    //     console.log('***************set', props, doc);
    //     doc.update(props);
    // }
    //
    // save(doc, modelName, cb) {
    //     console.log('***************save', doc, modelName, cb);
    //     process.nextTick(cb);
    // }
    //
    // destroy(doc, modelName, cb) {
    //     console.log('***************destroy', doc, modelName, cb);
    //     doc.delete();
    //     process.nextTick(cb);
    // }
}
