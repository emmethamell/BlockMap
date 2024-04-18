
function convertTime(excelDateTime) {
    const excelTime = excelDateTime % 1; 
    const hours = Math.floor(excelTime * 24);
    const minutes = Math.round((excelTime * 24 - hours) * 60);
    return hours * 100 + minutes; 
}


export { convertTime }

