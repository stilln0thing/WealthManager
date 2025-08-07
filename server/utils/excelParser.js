const xlsx = require("xlsx");
const path = require("path");

function excelDateToJSDate(serial) {
  // Convert Excel serial date to JS Date string (YYYY-MM-DD)
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000).toISOString().split("T")[0];
}

function parseExcelFile() {
  const filePath = path.join(__dirname, "../data/Sample Portfolio Dataset for Assignment.xlsx");
  const workbook = xlsx.readFile(filePath);
  const data = {};

  workbook.SheetNames.forEach((sheet) => {
    let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

    // Convert Excel serial numbers to dates if sheet is Historical_Performance
    if (sheet === "Historical_Performance") {
      sheetData = sheetData.map((row) => {
        if (typeof row.Date === "number") {
          return { ...row, Date: excelDateToJSDate(row.Date) };
        }
        return row;
      });
    }

    console.log(`📝 Sheet: ${sheet}`);
    console.dir(sheetData.slice(0, 3), { depth: null }); // print first 3 rows
    data[sheet] = sheetData;
  });

  return data;
}

module.exports = parseExcelFile;
