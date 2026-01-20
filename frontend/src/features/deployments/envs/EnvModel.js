// EnvModel.js
class EnvModel {
  #data = {
    id: "",
    app: null, // id de App
    name: "",  // p.ej. "production", "staging"
  };

  constructor(initialData = {}) {
    if (initialData.id !== undefined) {
      this.#data.id = initialData.id;
    }
    this.#data.app  = initialData.app  ?? this.#data.app;
    this.#data.name = initialData.name ?? this.#data.name;
  }

  // Getters
  get id()   { return this.#data.id; }
  get app()  { return this.#data.app; }
  get name() { return this.#data.name; }

  // Setters
  set id(v)   { this.#data.id = v; }
  set app(v)  { this.#data.app = v; }
  set name(v) { this.#data.name = v; }

  toJSON() {
    return {
      id: this.#data.id,
      app: this.#data.app,
      name: this.#data.name,
    };
  }

  toAddPayload() {
    return {
      app: this.#data.app,
      name: this.#data.name,
    };
  }

  toEditPayload() {
    const p = {};
    if (this.#data.name) p.name = this.#data.name;
    // normalmente no cambias el app asociado
    return p;
  }

  toOption() {
    return {
      value: this.#data.id,
      label: this.#data.name,
    };
  }

  static fromAPI(obj = {}) {
    return new EnvModel({
      id: obj.id ?? "",
      app: obj.app ?? null,
      name: obj.name ?? "",
    });
  }
}

export { EnvModel };
