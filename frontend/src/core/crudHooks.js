import { makeQueryHook, makeMutationHook } from "./reactQuery";

/**
 * Crea hooks CRUD genéricos para un recurso REST y permite adaptar el resultado
 * para UI (por ejemplo, devolver {value,label} en la lista).
 *
 * @param {Object} opts
 * @param {ApiClient} opts.client
 * @param {string} opts.basePath
 * @param {string} [opts.resource="resource"]
 * @param {function} [opts.mapOne]      // raw -> domain/model (antes del adapter)
 * @param {function} [opts.mapMany]     // raw[] -> domain/model[] (antes del adapter)
 * @param {"PUT"|"PATCH"} [opts.updateMethod="PUT"]
 * @param {function} [opts.makeKeys]
 * @param {boolean}  [opts.asOptions=false]  // atajo: convierte a {value,label}
 * @param {function} [opts.listAdapter]      // domain[] -> UI[]
 * @param {function} [opts.detailAdapter]    // domain -> UI
 */
export function makeCrudHooks({
  client,
  basePath,
  resource = "resource",
  mapOne = (x) => x,
  mapMany = (arr) => (Array.isArray(arr) ? arr.map(mapOne) : []),
  updateMethod = "PUT",
  makeKeys,
  asOptions = false,
  listAdapter,
  detailAdapter,
}) {
  if (!client) throw new Error("client required");
  if (!basePath) throw new Error("basePath required");

  // --- Adapters por defecto ---
  const optionOf = (item) => {
    // intenta usar toOption(); si no, fallback id/name
    if (item?.toOption) return item.toOption();
    return { value: item?.id ?? "", label: item?.name ?? "" };
  };

  const defaultListAdapter   = (arr) => (Array.isArray(arr) ? arr : []);
  const defaultDetailAdapter = (x) => x;

  // Si asOptions=true, adaptamos a value/label
  const finalListAdapter   = asOptions
    ? (arr) => (Array.isArray(arr) ? arr.map(optionOf) : [])
    : (typeof listAdapter === "function" ? listAdapter : defaultListAdapter);

  const finalDetailAdapter = asOptions
    ? (x) => (x == null ? x : optionOf(x))
    : (typeof detailAdapter === "function" ? detailAdapter : defaultDetailAdapter);

  // --- Endpoints (con mapeo de red -> dominio) ---
  const endpoints = {
    list:   { method: "GET",  path: basePath,                      responseMapper: (raw) => mapMany(raw) },
    create: { method: "POST", path: `${basePath}/`,                      responseMapper: (raw) => mapOne(raw)  },
    detail: { method: "GET",  path: ({ id }) => `${basePath}/${id}/`, responseMapper: (raw) => mapOne(raw) },
    update: { method: updateMethod, path: ({ id }) => `${basePath}/${id}/`, responseMapper: (raw) => mapOne(raw) },
    remove: { method: "DELETE", path: ({ id }) => `${basePath}/${id}/` },
  };

  // --- Query keys ---
  const keys = makeKeys || {
    all:    () => [resource],
    detail: (id) => [resource, id],
  };

  // --- Hooks base (entregan dominio) ---
  const baseUseList   = makeQueryHook(client, endpoints.list,   () => keys.all());
  const baseUseDetail = makeQueryHook(client, endpoints.detail, (_req, params) => keys.detail(params?.id));

  // --- Hooks expuestos (adaptan a la UI y normalizan) ---
  function useList(req, pathParams, options) {
    const q = baseUseList(req, pathParams, options);
    const adapted = finalListAdapter(q.data);
    return { ...q, data: Array.isArray(adapted) ? adapted : [] }; // SIEMPRE array
  }

  function useDetail(req, pathParams, options) {
    const q = baseUseDetail(req, pathParams, options);
    return { ...q, data: q.data == null ? q.data : finalDetailAdapter(q.data) };
  }

  // --- Mutaciones ---
  const useCreate = makeMutationHook(client, endpoints.create, {
    afterSuccess: (qc) => qc.invalidateQueries({ queryKey: keys.all() }),
  });

  const useUpdate = makeMutationHook(client, endpoints.update, {
    afterSuccess: (qc, _data, { pathParams }) => {
      if (pathParams?.id) qc.invalidateQueries({ queryKey: keys.detail(pathParams.id) });
      qc.invalidateQueries({ queryKey: keys.all() });
    },
  });

  const useDelete = makeMutationHook(client, endpoints.remove, {
    afterSuccess: (qc, _data, { pathParams }) => {
      qc.invalidateQueries({ queryKey: keys.all() });
      if (pathParams?.id) qc.removeQueries({ queryKey: keys.detail(pathParams.id) });
    },
  });

  return { useList, useDetail, useCreate, useUpdate, useDelete, endpoints, keys };
}
