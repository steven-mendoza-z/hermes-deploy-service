import { ApiClient } from "../../../core/http";
import { makeCrudHooks } from "../../../core/crudHooks";
import { DEPLOY_API_URL } from "../../../config/services";
import { ServerModel } from "./ServerModel";

const api = new ApiClient(DEPLOY_API_URL);

export const {
  useList:   useServers,      // -> data: [{ value, label }]
  useDetail: useServer,       // -> data: { value, label } (si asOptions=true)
  useCreate: useCreateServer,
  useUpdate: useUpdateServer,
  useDelete: useDeleteServer,
} = makeCrudHooks({
  client: api,
  basePath: "/servers",
  resource: "servers",
  mapOne: (raw) => ServerModel.fromAPI(raw),
  // mapMany por defecto usa mapOne
  asOptions: false,

  listAdapter: (arr) =>
    Array.isArray(arr)
      ? arr.map((serverModel) =>
          serverModel?.toJSON
            ? serverModel.toJSON() // -> { id, user, name, email, region, ssh_key }
            : serverModel
        )
      : [],
});

export async function getServerStatus(id) {
  const res = await fetch(`http://127.0.0.1:8000/servers/${id}/status/`);
  const data = await res.json();
  console.log("status data", id, data);

  return data;
}

