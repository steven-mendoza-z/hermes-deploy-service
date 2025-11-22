import { ApiClient } from "../../../core/http";
import { makeCrudHooks } from "../../../core/crudHooks";
import { DEPLOY_API_URL } from "../../../config/services";
import { RepoModel } from "./RepoModel";

const api = new ApiClient(DEPLOY_API_URL);

export const {
  useList:   useRepos,      // -> data: [{ value, label }]
  useDetail: useRepo,       // -> data: { value, label } (si asOptions=true)
  useCreate: useCreateRepo,
  useUpdate: useUpdateRepo,
  useDelete: useDeleteRepo,
} = makeCrudHooks({
  client: api,
  basePath: "/repos",
  resource: "repos",
  mapOne: (raw) => RepoModel.fromAPI(raw),
  // mapMany por defecto usa mapOne
  // asOptions: true, // esto hace que los hooks expongan value/label
});
