import { maxImages } from "../constants";

export const updateImages = (response, selectedImages) => {
  let newImages = selectedImages;
  const length = response.length;
  const selected = newImages.filter((item) => item.uri !== "").length;
  const remaining = maxImages - selected;
  const take = remaining > length ? length : remaining;

  //   console.log("selected", selected);
  //   console.log("new images length", length);
  //   console.log("max images: ", maxImages);
  //   console.log("remaining", remaining);

  return take;
};
