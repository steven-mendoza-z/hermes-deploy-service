import { ApiClient } from "../../../core/http";
import { makeCrudHooks } from "../../../core/crudHooks";
import { DEPLOY_API_URL } from "../../../config/services";
import { ImageModel } from "./ImageModel";

const api = new ApiClient(DEPLOY_API_URL);

export const {
  useList:   useImages,      // -> data: [{ value, label }]
  useDetail: useImage,       // -> data: { value, label } (si asOptions=true)
  useCreate: useCreateImage,
  useUpdate: useUpdateImage,
  useDelete: useDeleteImage,
} = makeCrudHooks({
  client: api,
  basePath: "/images",
  resource: "images",
  mapOne: (raw) => ImageModel.fromAPI(raw),
  // mapMany por defecto usa mapOne
  // asOptions: true, // esto hace que los hooks expongan value/label
});
