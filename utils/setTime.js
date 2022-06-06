export const setTime = (item) => {
  let time = item.timestamp;
  if (time != undefined) {
    let timePosted = time.integerValue;
    let currentTime = Date.now();
    let timeDifferenceMinutes = ((currentTime - timePosted) / 60000).toFixed(0);
    let timeDifferenceHours = (timeDifferenceMinutes / 60).toFixed(0);
    let timeDifferenceDays = (timeDifferenceHours / 24).toFixed(0);
    let timeDifferenceWeeks = (timeDifferenceDays / 7).toFixed(0);

    if (timeDifferenceMinutes <= 59) {
      if (timeDifferenceMinutes > 1) {
        return timeDifferenceMinutes + " minutes ago";
      } else {
        return timeDifferenceMinutes + " minute ago";
      }
    } else if (timeDifferenceMinutes > 59 && timeDifferenceHours <= 23) {
      if (timeDifferenceHours > 1) {
        return timeDifferenceHours + " hours ago";
      } else {
        return timeDifferenceHours + " hour ago";
      }
    } else if (
      timeDifferenceDays <= 6 &&
      timeDifferenceMinutes > 59 &&
      timeDifferenceHours > 23
    ) {
      if (timeDifferenceDays > 1) {
        return timeDifferenceDays + " days ago";
      } else {
        return timeDifferenceDays + " day ago";
      }
    } else if (
      timeDifferenceWeeks <= 10 &&
      timeDifferenceDays > 6 &&
      timeDifferenceMinutes > 59 &&
      timeDifferenceHours > 23
    ) {
      if (timeDifferenceWeeks > 1) {
        return timeDifferenceWeeks + " weeks ago";
      } else {
        return timeDifferenceWeeks + " week ago";
      }
    } else {
      return "10+ weeks ago";
    }
  }
};
