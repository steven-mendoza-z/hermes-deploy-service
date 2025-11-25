import { ApiClient } from "../../../core/http";
import { makeCrudHooks } from "../../../core/crudHooks";
import { DEPLOY_API_URL } from "../../../config/services";
import { RepoModel } from "./RepoModel";

const api = new ApiClient(DEPLOY_API_URL);

export const {
  useList:   useRepos,
  useDetail: useRepo,
  useCreate: useCreateRepo,
  useUpdate: useUpdateRepo,
  useDelete: useDeleteRepo,
} = makeCrudHooks({
  client: api,
  basePath: "/repos",
  resource: "repos",
  mapOne: (raw) => RepoModel.fromAPI(raw),
  // mapMany por defecto usa mapOne

  // 👇 Igual que en servers: exposición como POJO
  listAdapter: (arr) =>
    Array.isArray(arr)
      ? arr.map((repoModel) =>
          repoModel?.toJSON ? repoModel.toJSON() : repoModel
        )
      : [],
});
