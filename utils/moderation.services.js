import axios from "axios";

const API_USER = "278265377";
const API_KEY = "38GEu5SU32yy5SYjvzhe";

export async function moderateImage(imgUrl) {
  const result = await axios
    .get("https://api.sightengine.com/1.0/check.json", {
      params: {
        url: imgUrl,
        models: "nudity,wad,offensive,gore",
        api_user: API_USER,
        api_secret: API_KEY,
      },
    })
    .then(function (response) {
      return checkImageResults(response.data);
    })
    .catch(function (error) {
      if (error.response) console.log(error.response.data);
      else console.log(error.message);
    });
  return result;
}
function checkImageResults(data) {
  let drugs = data.drugs > 0.8;
  let nudity = data.nudity.safe < 0.2;
  let offensive = data.offensive.prob > 0.8;
  let weapons = data.weapon > 0.8;
  let gore = data.gore.prob > 0.8;
  if (drugs || nudity || offensive || weapons || gore) {
    return true;
  } else {
    return false;
  }
}

export const moderateText = async (text) => {
  const result = await axios
    .get("https://api.sightengine.com/1.0/text/check.json", {
      params: {
        text: text,
        lang: "en",
        opt_countries: "us,gb,fr",
        mode: "standard",
        api_user: `${API_USER}`,
        api_secret: `${API_KEY}`,
      },
    })
    .then(function (response) {
      return textResults(response.data.profanity.matches);
    })
    .catch(function (error) {
      if (error.response)
        console.log("error text moderation axios call: ", error.response);
      else console.log("error: ", error.message);
    });
  return result;
};
function textResults(response) {
  if (response.length > 0) {
    if (response[0].intensity == "high" || response[0].intensity == "medium") {
      return true;
    }
  } else {
    return false;
  }
}
