import XLSX from "xlsx";
import { buildingCodes } from "./building-codes.mjs";
import moment from 'moment';
import { parse,format } from 'date-fns';
/** 
 * converts excel times to valid eastern standard time (EST)
 * @returns {int}
 */
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
/** 
 * Takes double input and returns the yyyy-mm-dd date
 * @returns {string}
 */
function convertDates(excelDate){
    const baseDate = moment("1899-12-30");
    const date = baseDate.add(excelDate, 'days')
    
    if(date.isAfter("1900-03-01")){
        date.subtract(1, 'days')
    }

    const formattedDate = date.format('YYYY-MM-DD');
    return formattedDate
}

/** 
 * Takes no input and returns the JSON formatted data from Excel sheet.
 * @returns Array of JSON formatted objects
 */
function getData() {
    const workbook = XLSX.readFile("./Spring_2024_Class_Schedule.xlsx");
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

/** 
 * Takes a location string and returns the correctly formatted building code and room code.
 * If building code cannot be found, returns [null, null].
 * @param {string} locationString location string from excel sheet
 * @returns {[string, string] | [null, null]} [building_code, room_code] | [null, null]
 */
function getBuildingAndRoomCodes(locationString) {
    // remove all hyphens (if they exist)
    locationString = locationString.replace("-", ""); 
    /* 
     * Get building code. This works because the building code list is in ascending order,
     * i.e. "BCABZSN" comes before "BCA". If location string starts with "BCABZSN", then its 
     * building code will be correctly identified as "BCABZSN", and not "BCA". If the list
     * were in descending order, it would be identified first as "BCA", which is *not* correct. 
     */
    let building = buildingCodes.find(code => locationString.startsWith(code));
    if (!building) { return [null, null]; }
    // get room code (all characters after building code, leading zeroes removed)
    let room = locationString.substring(building.length).replace(/^0+/, "");
    return [building, room];
}

/** 
* Takes a room document and string date as input. Returns a block object containing room hours
*@param {object} room 
*@param {string} date 
*@returns {string:[int,int]}
*/
function formatExceptionDates(room, date){
    let blocks = {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu:[],
        Fri: [],
        Sat: [],
        Sun: []
    }
    
    if("exceptions" in room && date in room.exceptions){
        for(const [date,times] of Object.entries(room.exceptions)){
            const formatDate = parse(date, 'yyyy-MM-dd', new Date())
            
            let dayOfWeek = format(formatDate, 'EEEE')
            switch(dayOfWeek){
                case 'Monday':
                    blocks.Mon.push(times);
                    break;
                case 'Tuesday':
                    blocks.Tue.push(times);
                    break;
                case 'Wednesday':
                    blocks.Wed.push(times);
                     break;
                case 'Thursday':
                    blocks.Thu.push(times);
                     break;
                case 'Friday':
                    blocks.Fri.push(times);
                    break;
                case 'Saturday':
                    blocks.Sat.push(times);
                    break;
                 case 'Sunday':
                    blocks.Sun.push(times);
                    break;
            }
        }
    }else{
        blocks = room.blocks
    }
    return blocks
}


export { formatExceptionDates, convertTime, getData, convertDates, getBuildingAndRoomCodes}

