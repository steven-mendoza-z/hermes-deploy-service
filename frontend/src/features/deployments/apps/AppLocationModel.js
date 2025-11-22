class AppLocationModel {
  #data = {
    id: "",
    server: null,  // id o ServerModel
    port: null,
  };

  constructor(initialData = {}) {
    Object.assign(this.#data, initialData);
  }

  // Getters
  get id() { return this.#data.id; }
  get server() { return this.#data.server; }
  get port() { return this.#data.port; }

  // Setters
  set id(v) { this.#data.id = v; }
  set server(v) { this.#data.server = v; }
  set port(v) { this.#data.port = v; }

  // Serialización
  toJSON() {
    return {
      id: this.#data.id,
      server: this.#data.server,
      port: this.#data.port,
    };
  }

  toAddPayload() {
    return {
      server: this.#data.server,
      port: this.#data.port,
    };
  }

  toEditPayload() {
    const p = {};
    if (this.#data.server) p.server = this.#data.server;
    if (this.#data.port != null) p.port = this.#data.port;
    return p;
  }

  // Helpers UI
  toOption() {
    return {
      value: this.#data.id,
      label: `Server: ${this.#data.server} · Port: ${this.#data.port}`,
    };
  }

  // Factory desde API
  static fromAPI(obj = {}) {
    return new AppLocationModel({
      id: obj.id ?? "",
      server: obj.server ?? null,
      port: obj.port ?? null,
    });
  }
}

export { AppLocationModel };
