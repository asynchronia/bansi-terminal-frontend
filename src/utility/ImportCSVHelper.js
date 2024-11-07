import * as XLSX from 'xlsx';

export const importCSVHelper = async (file) => {
  try {
    // Read the file data and convert it to JSON
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const extractedData = XLSX.utils.sheet_to_json(worksheet); 

    // Return the unfiltered JSON data
    return extractedData
  } catch (error) {
    console.error('Error reading file:', error);
    return null; // Return null or handle error as needed
  }
};
