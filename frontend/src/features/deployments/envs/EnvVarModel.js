// EnvVarModel.js
class EnvVarModel {
  #data = {
    id: "",
    env: "",   // id del Env al que pertenece
    name: "",
    value: "", // solo se usa para enviar, no lo recibirás del backend
  };

  constructor(initialData = {}) {
    if (initialData.id !== undefined) {
      this.#data.id = initialData.id;
    }
    this.#data.env   = initialData.env   ?? this.#data.env;
    this.#data.name  = initialData.name  ?? this.#data.name;
    this.#data.value = initialData.value ?? this.#data.value;
  }

  // Getters
  get id()    { return this.#data.id; }
  get env()   { return this.#data.env; }
  get name()  { return this.#data.name; }
  get value() { return this.#data.value; }

  // Setters
  set id(v)    { this.#data.id = v; }
  set env(v)   { this.#data.env = v; }
  set name(v)  { this.#data.name = v; }
  set value(v) { this.#data.value = v; }

  // Serialización (para UI interna)
  toJSON() {
    return {
      id: this.#data.id,
      env: this.#data.env,
      name: this.#data.name,
      // OJO: no metas value aquí si luego lo muestras tal cual
      value: this.#data.value,
    };
  }

  // Crear (POST)
  toAddPayload() {
    return {
      env: this.#data.env,
      name: this.#data.name,
      value: this.#data.value,
    };
  }

  // Editar (PATCH/PUT) -> no cambiamos env por defecto
  toEditPayload() {
    const p = {};
    if (this.#data.name)  p.name  = this.#data.name;
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
      env: obj.env ?? obj.env_id ?? "",
      name: obj.name ?? "",
      // value no viene del backend (write_only), lo dejamos vacío
      value: "",
    });
  }
}

export { EnvVarModel };
