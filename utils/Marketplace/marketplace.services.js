import { maxImages } from "../constants";
import { uploadImageToStorage } from "../firebase.services";

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

export const uploadMarketplaceImages = async (images, id) => {
  const publicLinks = [];
  const urls = images
    .filter((image) => image.uri !== "")
    .map((image) => {
      return image.uri;
    });

  for await (const url of urls) {
    const imageName = url.split("/").pop();
    console.log("uploading image: ", imageName);
    const imagePath = `Images/Posts/Marketplace/${id}/${imageName}.jpeg`; // 1, 2, 3, 4, 5
    const imageUrl = await uploadImageToStorage(imagePath, url);
    if (imageUrl) {
      publicLinks.push(imageUrl);
      console.log("uploaded");
    }
  }

  return publicLinks;
};
