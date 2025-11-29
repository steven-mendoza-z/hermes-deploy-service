// ImageModel.js
class ImageModel {
  #data = {
    id: "",
    name: "",
    url: "",
    repository: null, // id o RepositoryModel
    branch: "",
    version: "",      // <-- NUEVO
  };

  constructor(initialData = {}) {
    if (initialData.id !== undefined) {
      this.#data.id = initialData.id;
    }
    this.#data.name       = initialData.name       ?? this.#data.name;
    this.#data.url        = initialData.url        ?? this.#data.url;
    this.#data.repository = initialData.repository ?? this.#data.repository;
    this.#data.branch     = initialData.branch     ?? this.#data.branch;
    this.#data.version    = initialData.version    ?? this.#data.version; // <-- NUEVO
  }

  // Getters
  get id() { return this.#data.id; }
  get name() { return this.#data.name; }
  get url() { return this.#data.url; }
  get repository() { return this.#data.repository; }
  get branch() { return this.#data.branch; }
  get version() { return this.#data.version; }  // <-- NUEVO

  // Setters
  set id(v) { this.#data.id = v; }
  set name(v) { this.#data.name = v; }
  set url(v) { this.#data.url = v; }
  set repository(v) { this.#data.repository = v; }
  set branch(v) { this.#data.branch = v; }
  set version(v) { this.#data.version = v; }  // <-- NUEVO

  // Serialización
  toJSON() {
    return {
      id: this.#data.id,
      name: this.#data.name,
      url: this.#data.url,
      repository: this.#data.repository,
      branch: this.#data.branch,
      version: this.#data.version,   // <-- NUEVO
    };
  }

  toAddPayload() {
    return {
      name: this.#data.name,
      url: this.#data.url,
      repository: this.#data.repository,
      branch: this.#data.branch,
      version: this.#data.version,   // <-- NUEVO
    };
  }

  toEditPayload() {
    const p = {};
    if (this.#data.name)       p.name       = this.#data.name;
    if (this.#data.url)        p.url        = this.#data.url;
    if (this.#data.repository) p.repository = this.#data.repository;
    if (this.#data.branch)     p.branch     = this.#data.branch;
    if (this.#data.version)    p.version    = this.#data.version; // <-- NUEVO
    return p;
  }

  // Helpers UI
  toOption() {
    return {
      value: this.#data.id,
      label: this.#data.name + (this.#data.version ? ` (${this.#data.version})` : ""), // opcional
    };
  }

  // Factory desde API
  static fromAPI(obj = {}) {
    return new ImageModel({
      id: obj.id ?? "",
      name: obj.name ?? "",
      url: obj.url ?? "",
      repository: obj.repository ?? null,
      branch: obj.branch ?? "",
      version: obj.version ?? "",   // <-- NUEVO
    });
  }
}

export { ImageModel };
