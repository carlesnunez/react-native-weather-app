export function applyActionToModelReducer(orm, modelName, action, session) {
  session[modelName].reducer(action, session[modelName], session);
}

export class ReduxORMAdapter {
  constructor(session) {
    this.session = session;
  }

  build(modelName, props) {
    return this.session[modelName].create(props);
  }

  get(model, attr) {
    return model[attr];
  }

  async save(model, Model) {
   return model;
  }

  async destroy(model, Model) {
    return Promise.resolve(model.destroy()).then(() => model);
  }
}
