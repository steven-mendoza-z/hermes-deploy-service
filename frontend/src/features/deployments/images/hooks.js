import { ApiClient } from "../../../core/http";
import { makeCrudHooks } from "../../../core/crudHooks";
import { DEPLOY_API_URL } from "../../../config/services";
import { ImageModel } from "./ImageModel";

const api = new ApiClient(DEPLOY_API_URL);

export const {
  useList:   useImages,
  useDetail: useImage,
  useCreate: useCreateImage,
  useUpdate: useUpdateImage,
  useDelete: useDeleteImage,
} = makeCrudHooks({
  client: api,
  basePath: "/images",
  resource: "images",
  mapOne: (raw) => ImageModel.fromAPI(raw),
  // mapMany por defecto usa mapOne

  listAdapter: (arr) =>
    Array.isArray(arr)
      ? arr.map((imageModel) =>
          imageModel?.toJSON ? imageModel.toJSON() : imageModel
        )
      : [],
});
