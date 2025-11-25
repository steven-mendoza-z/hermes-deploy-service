import { ApiClient } from "../../../core/http";
import { makeCrudHooks } from "../../../core/crudHooks";
import { DEPLOY_API_URL } from "../../../config/services";
import { AppModel } from "./AppModel";

const api = new ApiClient(DEPLOY_API_URL);

export const {
  useList:   useApps,
  useDetail: useApp,
  useCreate: useCreateApp,
  useUpdate: useUpdateApp,
  useDelete: useDeleteApp,
} = makeCrudHooks({
  client: api,
  basePath: "/apps",
  resource: "apps",
  mapOne: (raw) => AppModel.fromAPI(raw),
  // mapMany por defecto usa mapOne

  listAdapter: (arr) =>
    Array.isArray(arr)
      ? arr.map((appModel) =>
          appModel?.toJSON ? appModel.toJSON() : appModel
        )
      : [],
});
