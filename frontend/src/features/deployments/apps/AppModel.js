// AppModel.js
class AppModel {
  #data = {
    id: "",
    name: "",
    domain: "",
    repo: null,       // id o RepoModel
    repoName: "",     // <- nombre del repo (read-only, viene del backend)
    branch: "",
    server: null,     // id o ServerModel
    serverName: "",
    serverIp: "",
  };

  constructor(initialData = {}) {
    if (initialData.id !== undefined) {
      this.#data.id = initialData.id;
    }
    this.#data.name       = initialData.name       ?? this.#data.name;
    this.#data.domain     = initialData.domain     ?? this.#data.domain;
    this.#data.repo       = initialData.repo       ?? this.#data.repo;
    this.#data.repoName   = initialData.repoName   ?? this.#data.repoName;
    this.#data.branch     = initialData.branch     ?? this.#data.branch;
    this.#data.server     = initialData.server     ?? this.#data.server;
    this.#data.serverName = initialData.serverName ?? this.#data.serverName;
    this.#data.serverIp   = initialData.serverIp   ?? this.#data.serverIp;
  }

  // Getters
  get id()         { return this.#data.id; }
  get name()       { return this.#data.name; }
  get domain()     { return this.#data.domain; }
  get repo()       { return this.#data.repo; }
  get repoName()   { return this.#data.repoName; }
  get branch()     { return this.#data.branch; }
  get server()     { return this.#data.server; }
  get serverName() { return this.#data.serverName; }
  get serverIp()   { return this.#data.serverIp; }

  // Setters
  set id(v)         { this.#data.id = v; }
  set name(v)       { this.#data.name = v; }
  set domain(v)     { this.#data.domain = v; }
  set repo(v)       { this.#data.repo = v; }
  set repoName(v)   { this.#data.repoName = v; } // normalmente no lo tocarás a mano
  set branch(v)     { this.#data.branch = v; }
  set server(v)     { this.#data.server = v; }
  set serverName(v) { this.#data.serverName = v; }
  set serverIp(v)   { this.#data.serverIp = v; }

  // Serialización completa (incluye campos de display)
  toJSON() {
    return {
      id: this.#data.id,
      name: this.#data.name,
      domain: this.#data.domain,
      repo: this.#data.repo,
      repoName: this.#data.repoName,
      branch: this.#data.branch,
      server: this.#data.server,
      serverName: this.#data.serverName,
      serverIp: this.#data.serverIp,
    };
  }

  // Payload para crear (POST) -> NO enviamos repoName/serverName/serverIp
  toAddPayload() {
    return {
      name: this.#data.name,
      domain: this.#data.domain,
      repo: this.#data.repo,
      branch: this.#data.branch,
      server: this.#data.server,
    };
  }

  // Payload para editar (PATCH/PUT)
  toEditPayload() {
    const p = {};
    if (this.#data.name)      p.name   = this.#data.name;
    if (this.#data.domain)    p.domain = this.#data.domain;
    if (this.#data.repo !== null && this.#data.repo !== undefined)
      p.repo = this.#data.repo;
    if (this.#data.branch)    p.branch = this.#data.branch;
    if (this.#data.server !== null && this.#data.server !== undefined)
      p.server = this.#data.server;
    return p;
  }

  // Helpers UI
  toOption() {
    return {
      value: this.#data.id,
      label: this.#data.name || this.#data.domain,
    };
  }

  // Factory desde API
  static fromAPI(obj = {}) {
    return new AppModel({
      id: obj.id ?? "",
      name: obj.name ?? "",
      domain: obj.domain ?? "",
      repo: obj.repo ?? null,
      repoName: obj.repo_name ?? obj.repoName ?? "",
      branch: obj.branch ?? "",
      server: obj.server ?? null,
      serverName: obj.server_name ?? obj.serverName ?? "",
      serverIp: obj.server_ip ?? obj.serverIp ?? "",
    });
  }
}

export { AppModel };
