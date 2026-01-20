// ImageModel.js
class ImageModel {
  #data = {
    id: "",
    name: "",
    url: "",
    repository: null,      // id o RepoModel
    repositoryName: "",    // <- nombre del repo (read-only)
    branch: "",
    version: "",
  };

  constructor(initialData = {}) {
    if (initialData.id !== undefined) {
      this.#data.id = initialData.id;
    }
    this.#data.name            = initialData.name            ?? this.#data.name;
    this.#data.url             = initialData.url             ?? this.#data.url;
    this.#data.repository      = initialData.repository      ?? this.#data.repository;
    this.#data.repositoryName  = initialData.repositoryName  ?? this.#data.repositoryName;
    this.#data.branch          = initialData.branch          ?? this.#data.branch;
    this.#data.version         = initialData.version         ?? this.#data.version;
  }

  // Getters
  get id()              { return this.#data.id; }
  get name()            { return this.#data.name; }
  get url()             { return this.#data.url; }
  get repository()      { return this.#data.repository; }
  get repositoryName()  { return this.#data.repositoryName; }
  get branch()          { return this.#data.branch; }
  get version()         { return this.#data.version; }

  // Setters
  set id(v)              { this.#data.id = v; }
  set name(v)            { this.#data.name = v; }
  set url(v)             { this.#data.url = v; }
  set repository(v)      { this.#data.repository = v; }
  set repositoryName(v)  { this.#data.repositoryName = v; } // solo display
  set branch(v)          { this.#data.branch = v; }
  set version(v)         { this.#data.version = v; }

  // Serialización
  toJSON() {
    return {
      id: this.#data.id,
      name: this.#data.name,
      url: this.#data.url,
      repository: this.#data.repository,
      repositoryName: this.#data.repositoryName,
      branch: this.#data.branch,
      version: this.#data.version,
    };
  }

  // Payload crear (POST) -> sin repositoryName
  toAddPayload() {
    return {
      name: this.#data.name,
      url: this.#data.url,
      repository: this.#data.repository,
      branch: this.#data.branch,
      version: this.#data.version,
    };
  }

  // Payload editar (PATCH/PUT) -> sin repositoryName
  toEditPayload() {
    const p = {};
    if (this.#data.name)       p.name       = this.#data.name;
    if (this.#data.url)        p.url        = this.#data.url;
    if (this.#data.repository) p.repository = this.#data.repository;
    if (this.#data.branch)     p.branch     = this.#data.branch;
    if (this.#data.version)    p.version    = this.#data.version;
    return p;
  }

  // Helpers UI
  toOption() {
    return {
      value: this.#data.id,
      label:
        this.#data.name +
        (this.#data.version ? ` (${this.#data.version})` : ""),
    };
  }

  // Factory desde API
  static fromAPI(obj = {}) {
    return new ImageModel({
      id: obj.id ?? "",
      name: obj.name ?? "",
      url: obj.url ?? "",
      repository: obj.repository ?? null,
      repositoryName: obj.repository_name ?? obj.repositoryName ?? "", // <- mapeo
      branch: obj.branch ?? "",
      version: obj.version ?? "",
    });
  }
}

export { ImageModel };
