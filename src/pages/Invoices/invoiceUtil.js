function getDiffInMins(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (getDiffInMins(endDate) - getDiffInMins(startDate)) / millisecondsPerDay;
}

export const getDifferenceInDays= (date1, date2) => {
    let difference_in_time =
    date2.getTime() - date1.getTime();
 
// Calculating the no. of days between
// two dates
let difference_in_days =
    Math.round
        (difference_in_time / (1000 * 3600 * 24));

return difference_in_days;

}

export const ifOverDue = (currDate, dueDate) => {
    let date1 = new Date(currDate).getTime();
    let date2 = new Date(dueDate).getTime();
  
    if (date1 < date2) {
      return false;
    } else if (date1 > date2) {
      return true;
    } else {
      console.log(`Both dates are equal`);
        return false;
    }
  }

export const getDateInFormat = (dateInput) => {
// YYYY/MM/DD format

let dateObj = new Date(dateInput);

if (!isNaN(dateObj)) {
  let day = dateObj.getDate();
  day = day < 10 ? "0" + day : day;
  let month = dateObj.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  const year = dateObj.getFullYear();

  const resultDate = `${day}/${month}/${year}`;
  console.log(resultDate);  // 15/05/2019

  return resultDate;
}
console.error("Not a valid date object");
}