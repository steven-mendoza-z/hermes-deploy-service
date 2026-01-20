import { ApiClient } from "../../../core/http";
import { makeCrudHooks } from "../../../core/crudHooks";
import { DEPLOY_API_URL } from "../../../config/services";
import { EnvModel } from "./EnvModel";
import { EnvVarModel } from "./EnvVarModel";

const api = new ApiClient(DEPLOY_API_URL);

// ENVs (entornos por app)
export const {
  useList:   useEnvs,
  useDetail: useEnv,
  useCreate: useCreateEnv,
  useUpdate: useUpdateEnv,
  useDelete: useDeleteEnv,
} = makeCrudHooks({
  client: api,
  basePath: "/envs",
  resource: "envs",
  mapOne: (raw) => EnvModel.fromAPI(raw),
  listAdapter: (arr) =>
    Array.isArray(arr)
      ? arr.map((envModel) =>
          envModel?.toJSON ? envModel.toJSON() : envModel
        )
      : [],
});

// EnvVars (variables dentro de un Env)
export const {
  useList:   useEnvVars,
  useDetail: useEnvVar,
  useCreate: useCreateEnvVar,
  useUpdate: useUpdateEnvVar,
  useDelete: useDeleteEnvVar,
} = makeCrudHooks({
  client: api,
  basePath: "/env-vars",
  resource: "envvars",
  mapOne: (raw) => EnvVarModel.fromAPI(raw),
  listAdapter: (arr) =>
    Array.isArray(arr)
      ? arr.map((item) =>
          item?.toJSON ? item.toJSON() : item
        )
      : [],
});
