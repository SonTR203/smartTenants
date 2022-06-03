const setTime = (document) => {
  let time = document.timestamp;
  if (time != undefined) {
    let timePosted = time.integerValue;
    let currentTime = Date.now();
    let timeDifferenceMinutes = ((currentTime - timePosted) / 60000).toFixed(0);
    let timeDifferenceHours = (timeDifferenceMinutes / 60).toFixed(0);
    let timeDifferenceDays = (timeDifferenceHours / 24).toFixed(0);
    let timeDifferenceWeeks = (timeDifferenceDays / 7).toFixed(0);

    if (timeDifferenceMinutes <= 59) {
      return timeDifferenceMinutes > 1
        ? `${timeDifferenceMinutes} minutes ago`
        : `${timeDifferenceMinutes} minute ago`;
    } else if (timeDifferenceMinutes > 59 && timeDifferenceHours <= 23) {
      return timeDifferenceHours > 1
        ? `${timeDifferenceHours} hours ago`
        : `${timeDifferenceHours} hour ago`;
    } else if (
      timeDifferenceDays <= 6 &&
      timeDifferenceMinutes > 59 &&
      timeDifferenceHours > 23
    ) {
      return timeDifferenceDays > 1
        ? `${timeDifferenceDays} days ago`
        : `${timeDifferenceDays} day ago`;
    } else if (
      timeDifferenceWeeks <= 10 &&
      timeDifferenceDays > 6 &&
      timeDifferenceMinutes > 59 &&
      timeDifferenceHours > 23
    ) {
      return timeDifferenceWeeks > 1
        ? `${timeDifferenceWeeks} weeks ago`
        : `${timeDifferenceWeeks} week ago`;
    } else {
      return '10+ weeks ago';
    }
  }
};
export { setTime };
