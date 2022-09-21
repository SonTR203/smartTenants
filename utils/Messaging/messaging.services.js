import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

export const checkIfSold = async (id) => {
  const ref = doc(db, "Marketplace", id);
  const marketplacePost = await getDoc(ref);
  const postData = marketplacePost.data();

  if ((postData.isSold = true)) {
    return true;
  }
  return false;
};
