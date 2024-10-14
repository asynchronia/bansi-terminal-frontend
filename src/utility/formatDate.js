export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if(!isNaN(date)) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;

  } else {
    return "Invalid date"
  }
};
