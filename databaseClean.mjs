import XLSX from "xlsx";

//getting excel sheet data
function getData() {
    const workbook = XLSX.readFile("./Spring_2024_Class_Schedule.xlsx");
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet);
  }

const data = getData();


//finding columns with empty/missing data instances in Excel Sheet Data
let indexOfMissing = []

for(let i = 0; i < data.length; i++){
  if(data[i].Location === ""){ 
    indexOfMissing.push(i)
  }
}//We have 167 missing locations 


