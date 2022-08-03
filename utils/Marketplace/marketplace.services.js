import { maxImages } from "../constants";
import { uploadImageToStorage } from "../firebase.services";

export const updateImages = (response, selectedImages) => {
  let newImages = selectedImages;
  const length = response.length;
  const selected = newImages.filter((item) => item.uri !== "").length;
  const remaining = maxImages - selected;
  const take = remaining > length ? length : remaining;

  return take;
};

export const uploadMarketplaceImages = async (images, id) => {
  try {
    const publicLinks = [];
    const urls = images
      .filter((image) => image.uri !== "")
      .map((image) => {
        return image.uri;
      });

    console.log("there are : ", urls.length, " images to upload");

    for await (const url of urls) {
      const imageName = url.split("/").pop();
      console.log("uploading image: ", imageName);
      const imagePath = `Images/Posts/Marketplace/${id}/${imageName}.jpeg`; // 1, 2, 3, 4, 5
      console.log("imagePath: ", imagePath);
      const imageUrl = await uploadImageToStorage(imagePath, url);
      console.log("imageUrl: ", imageUrl);
      if (imageUrl) {
        publicLinks.push(imageUrl);
        console.log("uploaded");
      }
    }

    return publicLinks;
  } catch (err) {
    console.log("error uploading images", err);
    return null;
  }
};
