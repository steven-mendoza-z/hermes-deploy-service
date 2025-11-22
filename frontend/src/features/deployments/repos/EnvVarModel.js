// EnvVarModel.js
class EnvVarModel {
  #data = {
    id: "",
    name: "",
    value: "",
  };

  constructor(initialData = {}) {
    Object.assign(this.#data, initialData);
  }

  // Getters
  get id() { return this.#data.id; }
  get name() { return this.#data.name; }
  get value() { return this.#data.value; }

  // Setters
  set id(v) { this.#data.id = v; }
  set name(v) { this.#data.name = v; }
  set value(v) { this.#data.value = v; }

  // Serialización
  toJSON() {
    return {
      id: this.#data.id,
      name: this.#data.name,
      value: this.#data.value,
    };
  }

  toAddPayload() {
    return {
      name: this.#data.name,
      value: this.#data.value,
    };
  }

  toEditPayload() {
    const p = {};
    if (this.#data.name) p.name = this.#data.name;
    if (this.#data.value) p.value = this.#data.value;
    return p;
  }

  // Helpers UI
  toOption() {
    return {
      value: this.#data.id,
      label: this.#data.name,
    };
  }

  // Factory desde API
  static fromAPI(obj = {}) {
    return new EnvVarModel({
      id: obj.id ?? "",
      name: obj.name ?? "",
      value: obj.value ?? "",
    });
  }
}

export { EnvVarModel };
