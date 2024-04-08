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

  return resultDate;
}
console.error("Not a valid date object");
}

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export const indianNumberWords = (num) => {
    if (num === 0) return 'zero';

    const numberToWords = (num) => {
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
        if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
        if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
        if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
        return numberToWords(Math.floor(num / 10000000)) + ' crore' + (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
    };

    const [integerPart, decimalPart] = String(num).split('.').map(Number);

    let result = numberToWords(integerPart);

    if (decimalPart) {
        result += ' point';
        decimalPart.toString().slice(0, 2).split('').forEach(digit => {
            result += ' ' + ones[parseInt(digit)];
        });
    }

    return result;
};

export const formatNumberWithCommasAndDecimal = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return ''; 
  }
  const formattedNumber = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return formattedNumber;
};