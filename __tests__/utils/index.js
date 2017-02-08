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

  async save(model, Model) {
   return model;
  }

  async destroy(model, Model) {
    return Promise.resolve(model.destroy()).then(() => model);
  }

  get(model, attr) {
    return model[attr];
  }
}
