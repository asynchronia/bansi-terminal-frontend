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

export const numberToIndianWords = (number) => {
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', 'thousand', 'lakh', 'crore'];

  if (number === 0) return 'zero';

  // Split number into 2-digit chunks
  const chunks = [];
  while (number > 0) {
      chunks.push(number % 100);
      number = Math.floor(number / 100);
  }

  // Convert each chunk to words
  const wordsChunks = chunks.map((chunk, index) => {
      if (chunk === 0) return '';
      let words = '';
      const tensAndUnits = chunk % 100;
      const hundreds = Math.floor(chunk / 100);
      if (hundreds > 0) {
          words += units[hundreds] + ' hundred';
          if (tensAndUnits > 0) words += ' and ';
      }
      if (tensAndUnits < 10) {
          words += units[tensAndUnits];
      } else if (tensAndUnits < 20) {
          words += teens[tensAndUnits - 10];
      } else {
          const tensDigit = Math.floor(tensAndUnits / 10);
          const unitsDigit = tensAndUnits % 10;
          words += tens[tensDigit];
          if (unitsDigit > 0) words += '-' + units[unitsDigit];
      }
      if (index > 0) words += ' ' + scales[index];
      return words;
  });

  // Join words chunks and trim any leading/trailing spaces
  return wordsChunks.reverse().join(' ').trim();
};

export const formatNumberWithCommasAndDecimal = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '';
  }
  const formattedNumber = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return formattedNumber;
};