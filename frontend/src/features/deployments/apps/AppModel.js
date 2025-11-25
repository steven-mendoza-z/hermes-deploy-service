// AppModel.js
class AppModel {
  #data = {
    id: "",
    name: "",
    domain: "",
    locations: [], // List<AppLocationModel> o ids
    image: null,   // id o ImageModel
  };

  constructor(initialData = {}) {
    if (initialData.id !== undefined) {
      this.#data.id = initialData.id;
    }
    this.#data.name      = initialData.name      ?? this.#data.name;
    this.#data.domain    = initialData.domain    ?? this.#data.domain;
    if (initialData.locations !== undefined) {
      this.#data.locations = initialData.locations ?? this.#data.locations;
    }
    this.#data.image     = initialData.image     ?? this.#data.image;
  }

  // Getters
  get id() { return this.#data.id; }
  get name() { return this.#data.name; }
  get domain() { return this.#data.domain; }
  get locations() { return this.#data.locations; }
  get image() { return this.#data.image; }

  // Setters
  set id(v) { this.#data.id = v; }
  set name(v) { this.#data.name = v; }
  set domain(v) { this.#data.domain = v; }
  set locations(v) { this.#data.locations = v || []; }
  set image(v) { this.#data.image = v; }

  // Serialización
  toJSON() {
    return {
      id: this.#data.id,
      name: this.#data.name,
      domain: this.#data.domain,
      locations: this.#data.locations,
      image: this.#data.image,
    };
  }

  toAddPayload() {
    return {
      name: this.#data.name,
      domain: this.#data.domain,
      locations: this.#data.locations,
      image: this.#data.image,
    };
  }

  toEditPayload() {
    const p = {};
    if (this.#data.name)      p.name      = this.#data.name;
    if (this.#data.domain)    p.domain    = this.#data.domain;
    if (this.#data.locations) p.locations = this.#data.locations;
    if (this.#data.image)     p.image     = this.#data.image;
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
      locations: obj.locations ?? obj.appLocations ?? [],
      image: obj.image ?? null,
    });
  }
}

export { AppModel };
