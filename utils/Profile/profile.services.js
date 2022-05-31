import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const compressFileSize = async (uri) => {
  const compressedUri = await manipulateAsync(uri, [], {
    compress: 0.6,
    format: SaveFormat.PNG,
  });
  console.log("compressedUri", compressedUri);
  return compressedUri;
};

export const getFileInfo = async (fileURI) => {
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  if (fileInfo.size) {
    return fileInfo.size / 1024 / 1024;
  }
  return fileInfo;
};
