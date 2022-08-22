import { maxImages } from "../constants";
import { uploadImageToStorage } from "../firebase.services";
import _ from "lodash";

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
  } catch (err) {
    console.log("error uploading images", err);
    return null;
  }
};

export const getFilteredList = (
  data,
  category,
  condition,
  min,
  max
  // distance
) => {
  const filteredList = data.filter((item) => {
    if (
      (item.category == category || category == "All") &&
      (item.condition == condition || condition == "All") &&
      (parseFloat(item.price.substr(1).replace(",", "")) >= parseInt(min) ||
        min == "") &&
      (parseFloat(item.price.substr(1).replace(",", "")) <= parseInt(max) ||
        max == "")
    ) {
      return true;
    }

    return false;
  });

  return filteredList;
};

export const getSortedList = (data, sortingBy) => {
  let sortedList;
  switch (sortingBy) {
    case "Date(newest)":
      sortedList = _.sortBy(data, "timestamp");
      break;
    case "Date(oldest)":
      sortedList = _.sortBy(data, "timestamp").reverse();
      break;
    case "Price(lowest)":
      sortedList = data.sort((a, b) => {
        if (parseInt(a.price.substr(1)) < parseInt(b.price.substr(1))) {
          return 1;
        } else if (parseInt(a.price.substr(1)) > parseInt(b.price.substr(1))) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "Price(highest)":
      sortedList = data.sort((a, b) => {
        if (parseInt(a.price.substr(1)) > parseInt(b.price.substr(1))) {
          return 1;
        } else if (parseInt(a.price.substr(1)) < parseInt(b.price.substr(1))) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "Distance(closest)":
      break;
  }
  return sortedList;
};
