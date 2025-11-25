// RepoModel.js
class RepoModel {
  #data = {
    id: "",
    name: "",
    url: "",
    envVars: [], // List<EnvVarModel> o simples objetos
  };

  constructor(initialData = {}) {
    if (initialData.id !== undefined) {
      this.#data.id = initialData.id;
    }
    this.#data.name   = initialData.name   ?? this.#data.name;
    this.#data.url    = initialData.url    ?? this.#data.url;
    // soporta tanto envVars como enVals (por compatibilidad)
    if (initialData.envVars !== undefined || initialData.enVals !== undefined) {
      this.#data.envVars = initialData.envVars ?? initialData.enVals ?? this.#data.envVars;
    }
  }

  // Getters
  get id() { return this.#data.id; }
  get name() { return this.#data.name; }
  get url() { return this.#data.url; }
  get envVars() { return this.#data.envVars; }

  // Setters
  set id(v) { this.#data.id = v; }
  set name(v) { this.#data.name = v; }
  set url(v) { this.#data.url = v; }
  set envVars(v) { this.#data.envVars = v || []; }

  // Serialización
  toJSON() {
    return {
      id: this.#data.id,
      name: this.#data.name,
      url: this.#data.url,
      envVars: this.#data.envVars,
    };
  }

  toAddPayload() {
    return {
      name: this.#data.name,
      url: this.#data.url,
      envVars: this.#data.envVars,
    };
  }

  toEditPayload() {
    const p = {};
    if (this.#data.name)    p.name    = this.#data.name;
    if (this.#data.url)     p.url     = this.#data.url;
    if (this.#data.envVars) p.envVars = this.#data.envVars;
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
    return new RepoModel({
      id: obj.id ?? "",
      name: obj.name ?? "",
      url: obj.url ?? "",
      envVars: obj.envVars ?? obj.enVals ?? [],
    });
  }
}

export { RepoModel };
