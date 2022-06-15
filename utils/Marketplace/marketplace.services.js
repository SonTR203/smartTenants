import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
// import _ from "lodash";

export const getMarketplaceItems = async () => {
  const colRef = collection(db, "Marketplace");

  const data = await getDocs(colRef);
  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });

  // return formattedData with first item duplicated 10 times
  const duplicatedData = [
    ...formattedData,
    ...formattedData,
    ...formattedData,
    ...formattedData,
    ...formattedData,
  ];
  return duplicatedData; // mock data with 3 items
};
