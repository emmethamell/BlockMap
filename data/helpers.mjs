import XLSX from "xlsx";

function convertTime(excelDateTime) {
    let excelTime = excelDateTime % 1; 
    let hours = Math.floor(excelTime * 24);
    let minutes = Math.round((excelTime * 24 - hours) * 60);
    if (minutes === 60) {
        minutes = 0;
        hours++;
    }

    const time = hours * 100 + minutes;

    return time;
}


function getData() {
    const workbook = XLSX.readFile("./Spring_2024_Class_Schedule.xlsx");
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet);
}


export { convertTime, getData }

