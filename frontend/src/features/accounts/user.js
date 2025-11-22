// UserModel.js
class UserModel {
  #data = {
    id: "",
    name: "",
    email: "",
    password: "",
  };

  constructor(initialData = {}) {
    Object.assign(this.#data, initialData);
  }

  // Getters
  get id() { return this.#data.id; }
  get name() { return this.#data.name; }
  get email() { return this.#data.email; }
  get password() { return this.#data.password; }

  // Setters
  set id(v) { this.#data.id = v; }
  set name(v) { this.#data.name = v; }
  set email(v) { this.#data.email = v; }
  set password(v) { this.#data.password = v; }

  // Serialización
  toJSON() {
    return {
      id: this.#data.id,
      name: this.#data.name,
      email: this.#data.email,
      // normalmente el password NO se devuelve aquí
    };
  }

  toAddPayload() {
    return {
      name: this.#data.name,
      email: this.#data.email,
      password: this.#data.password,
    };
  }

  toEditPayload() {
    const p = {};
    if (this.#data.name) p.name = this.#data.name;
    if (this.#data.email) p.email = this.#data.email;
    if (this.#data.password) p.password = this.#data.password;
    return p;
  }

  // Helpers UI
  toOption() {
    return {
      value: this.#data.id,
      label: this.#data.name || this.#data.email,
    };
  }

  // Factory desde API
  static fromAPI(obj = {}) {
    return new UserModel({
      id: obj.id ?? "",
      name: obj.name ?? "",
      email: obj.email ?? "",
      // por si viene en el payload
      password: obj.password ?? "",
    });
  }
}

export { UserModel };
