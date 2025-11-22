// ServerModel.js
class ServerModel {
  #data = {
    id: "",
    name: "",
    ip: "",
    email: "",
    project: "",
    region: "",
    ssh_key: "",
    // status: "",  // si luego usas ServerStatus
  };

  constructor(initialData = {}) {
    Object.assign(this.#data, initialData);
  }

  // Getters
  get id() { return this.#data.id; }
  get name() { return this.#data.name; }
  get ip() { return this.#data.ip; }
  get email() { return this.#data.email; }
  get project() { return this.#data.project; }
  get region() { return this.#data.region; }
  get ssh_key() { return this.#data.ssh_key; }

  // Setters
  set id(v) { this.#data.id = v; }
  set name(v) { this.#data.name = v; }
  set ip(v) { this.#data.ip = v; }
  set email(v) { this.#data.email = v; }
  set project(v) { this.#data.project = v; }
  set region(v) { this.#data.region = v; }
  set ssh_key(v) { this.#data.ssh_key = v; }

  // Serialización
  toJSON() {
    return {
      id: this.#data.id,
      name: this.#data.name,
      ip: this.#data.ip,
      email: this.#data.email,
      project: this.#data.project,
      region: this.#data.region,
      // ssh_key: this.#data.ssh_key,
    };
  }

  toAddPayload() {
    return {
      name: this.#data.name,
      ip: this.#data.ip,
      email: this.#data.email,
      project: this.#data.project,
      region: this.#data.region,
      ssh_key: this.#data.ssh_key,
    };
  }

  toEditPayload() {
    const p = {};
    if (this.#data.name) p.name = this.#data.name;
    if (this.#data.ip) p.ip = this.#data.ip;
    if (this.#data.email) p.email = this.#data.email;
    if (this.#data.project) p.email = this.#data.project;
    if (this.#data.region) p.region = this.#data.region;
    if (this.#data.ssh_key) p.ssh_key = this.#data.ssh_key;
    return p;
  }

  // Helpers UI
  toOption() {
    return {
      value: this.#data.id,
      label: this.#data.name || this.#data.ip,
    };
  }

  // Factory desde API
  static fromAPI(obj = {}) {
    return new ServerModel({
      id: obj.id ?? "",
      name: obj.name ?? "",
      ip: obj.ip ?? "",
      email: obj.email ?? "",
      project: obj.project ?? "",
      region: obj.region ?? "",
      // ssh_key: obj.ssh_key ?? "",
    });
  }
}

export { ServerModel };
