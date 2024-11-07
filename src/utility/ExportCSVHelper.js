import * as XLSX from 'xlsx';

export const exportToCSVHelper = (data, fileName) => {
  // Filter data for the csv file (remove 'id' property)
  const filteredData = data.map(({ id, ...rest }) => rest);
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Export the workbook to CSV with the provided file name
  XLSX.writeFile(workbook, fileName, { bookType: 'csv' });
};
