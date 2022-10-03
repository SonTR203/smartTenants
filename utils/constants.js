import { Dimensions } from "react-native";

export const constants = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export const maxImages = 5;

export const refreshDelay = 2000;

export const categories = [
  {
    id: "1",
    category: "Clothes",
    subCategories: [
      { id: "10", category: "All" },
      { id: "11", category: "Womens clothes & shoes" },
      { id: "12", category: "Mens clothes & shoes" },
      { id: "13", category: "Womens accessories" },
      { id: "14", category: "Mens accessories" },
      { id: "15", category: "Clothes (Other)" },
    ],
  },
  {
    id: "2",
    category: "Electronics",
    subCategories: [
      { id: "20", category: "All" },

      { id: "21", category: "Cell phones & accessories" },
      { id: "22", category: "Computers & accessories" },
      { id: "23", category: "Photos & video" },
      { id: "24", category: "Home audio" },
      { id: "25", category: "Audio accessories" },
      { id: "26", category: "Tablets & e-readers" },
      { id: "27", category: "Electronics (Other)" },
    ],
  },
  { id: "3", category: "Free Goods" },
  {
    id: "4",
    category: "Health & beauty",
    subCategories: [
      { id: "40", category: "All" },
      { id: "41", category: "Makeup" },
      { id: "42", category: "Fragrance" },
      { id: "43", category: "Hair" },
      { id: "44", category: "Skincare" },
      { id: "45", category: "Tools" },
      { id: "46", category: "Bath & Body" },
      { id: "47", category: "Health & Beaty (Other)" },
    ],
  },
  {
    id: "5",
    category: "Hobbies & sports",
    subCategories: [
      { id: "50", category: "All" },
      { id: "51", category: "Musical instruments" },
      { id: "52", category: "Antiques & collectibles" },
      { id: "53", category: "Arts & crafts" },
      { id: "54", category: "Bicycles" },
      { id: "55", category: "Fitness equipment" },
      { id: "56", category: "Sports equipment" },
      { id: "57", category: "Outdoors recreation equipment" },
      { id: "58", category: "Hobbies & sports (Other)" },
    ],
  },
  {
    id: "6",
    category: "Home",
    subCategories: [
      { id: "60", category: "All" },
      { id: "61", category: "Appliances" },
      { id: "62", category: "Bedding" },
      { id: "63", category: "Cleaning supplies" },
      { id: "64", category: "Furniture" },
      { id: "65", category: "Decor" },
      { id: "66", category: "Lighing" },
      { id: "67", category: "Kitchen & dining" },
      { id: "68", category: "Storage & organization" },
      { id: "69", category: "Home (Other)" },
    ],
  },
  {
    id: "7",
    category: "Kids",
    subCategories: [
      { id: "70", category: "All" },
      { id: "71", category: "Kids clothes & shoes" },
      { id: "72", category: "Toys" },
      { id: "73", category: "Strollers" },
      { id: "74", category: "Car seats" },
      { id: "75", category: "Feeding supplies" },
      { id: "76", category: "Bathing supplies" },
      { id: "77", category: "Nursery" },
      { id: "78", category: "Kids (Other)" },
    ],
  },
  {
    id: "8",
    category: "Office goods",
    subCategories: [
      { id: "80", category: "All" },
      { id: "81", category: "Stationery" },
      { id: "82", category: "Desk organizers" },
      { id: "83", category: "Office goods (Other)" },
    ],
  },
  {
    id: "9",
    category: "Outdoor & garden",
    subCategories: [
      { id: "90", category: "All" },
      { id: "91", category: "Garden decor" },
      { id: "92", category: "Garden supplies" },
      { id: "93", category: "Outdoor lighting" },
      { id: "94", category: "Garden decor" },
    ],
  },
  {
    id: "10",
    category: "Pets",
    subCategories: [
      { id: "100", category: "All" },
      { id: "101", category: "Dogs" },
      { id: "102", category: "Cats" },
      { id: "103", category: "Birds" },
      { id: "104", category: "Fish" },
      { id: "105", category: "Other pets" },
      { id: "106", category: "Dog supplies" },
      { id: "107", category: "Cat supplies" },
      { id: "108", category: "Bird supplies" },
      { id: "109", category: "Fish supplies" },
      { id: "110", category: "Other pet supplies" },
    ],
  },
  {
    id: "11",
    category: "Toys & games",
    subCategories: [
      { id: "110", category: "All" },
      { id: "112", category: "Indoor games" },
      { id: "113", category: "Outdoor games" },
      { id: "114", category: "Toys" },
      { id: "115", category: "Toys & games (Other)" },
    ],
  },
  {
    id: "12",
    category: "Vehicles",
    subCategories: [
      { id: "120", category: "All" },
      { id: "121", category: "Cars" },
      { id: "122", category: "Motorcycles" },
      { id: "123", category: "Trailers" },
      { id: "124", category: "Trucks" },
      { id: "125", category: "Boats" },
      { id: "126", category: "RV" },
      { id: "127", category: "Vehicles (Other)" },
    ],
  },
];
