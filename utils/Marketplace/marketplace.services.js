import { maxImages } from "../constants";
import { increment } from "@firebase/firestore";
import {
  uploadImageToStorage,
  updateItemInFirestore,
  createListener,
} from "../firebase.services";
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

export const getFilteredList = (
  data,
  category,
  condition,
  min,
  max,
  distance
) => {
  // format min and max price $1,500.0 -> 1500
  min = Number(min.replace(/[^0-9.-]+/g, ""));
  max = Number(max.replace(/[^0-9.-]+/g, ""));

  let index = 1;

  if (category.split(" - ")[1] == "All") {
    index = 0;
  }

  const filteredList = data.filter((item) => {
    if (
      (item.category.split(" - ")[index] == category.split(" - ")[index] ||
        category == "All") &&
      (item.condition == condition || condition == "All") &&
      (parseFloat(item.price.substr(1).replace(",", "")) >= parseInt(min) ||
        min == "") &&
      (parseFloat(item.price.substr(1).replace(",", "")) <= parseInt(max) ||
        max == "") &&
      item.distance <= distance
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
      sortedList = _.sortBy(data, "timestamp").reverse();
      break;
    case "Date(oldest)":
      sortedList = _.sortBy(data, "timestamp");
      break;
    case "Price(highest)":
      sortedList = data.sort((a, b) => {
        if (
          parseInt(a.price.substr(1).replace(",", "")) <
          parseInt(b.price.substr(1).replace(",", ""))
        ) {
          return 1;
        } else if (
          parseInt(a.price.substr(1).replace(",", "")) >
          parseInt(b.price.substr(1).replace(",", ""))
        ) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "Price(lowest)":
      sortedList = data.sort((a, b) => {
        if (
          parseInt(a.price.substr(1).replace(",", "")) >
          parseInt(b.price.substr(1).replace(",", ""))
        ) {
          return 1;
        } else if (
          parseInt(a.price.substr(1).replace(",", "")) <
          parseInt(b.price.substr(1).replace(",", ""))
        ) {
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

// format price "0" -> "$0.00" after user finished entering
// will be moved to utils folder if used in multiple places
export const format = (amount) => {
  return (
    "$" +
    parseFloat(amount)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
  );
};

export const incrementItemCLicks = async (item) => {
  const properties = {
    clicks: increment(1),
  };
  try {
    updateItemInFirestore("Marketplace", item.id, properties);
  } catch (err) {
    console.error(err);
  }
};

export const listenForNewListing = (setter) => {
  return createListener("Marketplace", (snapshot) => {
    let approvedPosts = [];
    snapshot.docs.forEach((doc) => {
      if (doc.data().isNSFW || doc.data().isSold) return;
      return approvedPosts.push(doc.data());
    });
    setTimeout(() => {
      setter(approvedPosts.length);
    }, 3000);
  });
};
