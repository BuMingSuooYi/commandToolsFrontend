// 导出的日期提取函数
export function extractDate(timeString) {
  const regex = /^(\d{4}-\d{2}-\d{2}).*/; // 匹配 'yyyy-MM-dd' 格式的日期部分
  const match = timeString.match(regex);
  let extractedDate = '';
  if (match) {
    extractedDate = match[1]; // 匹配结果中的第一个捕获组是日期部分
  }
  return extractedDate;
}

// 导出的日期或者时间提取函数
export function extractDateOrTime(timeString){
	const inputDate = new Date(timeString);
	  const currentDate = new Date();
	
	  if (
	    inputDate.getDate() === currentDate.getDate() &&
	    inputDate.getMonth() === currentDate.getMonth() &&
	    inputDate.getFullYear() === currentDate.getFullYear()
	  ) {
	    // 日期是今天，输出时间
	    const hours = inputDate.getHours().toString().padStart(2, '0');
	    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
	    const time = `${hours}:${minutes}`;
	    return time;
	  } else {
	    // 日期不是今天，输出年月日
	    const year = inputDate.getFullYear();
	    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
	    const day = inputDate.getDate().toString().padStart(2, '0');
	    const date = `${year}-${month}-${day}`;
	    return date;
	  }
}

// 导出的日期和时间提取函数
export function extractTime(timeString) {
  const dateObject = new Date(timeString);
  
  // 提取日期部分（年、月、日）
  const datePart = dateObject.toISOString().split('T')[0];
  
  // 提取时间部分（时、分、秒、毫秒）
  const timePart = dateObject.toISOString().split('T')[1].split('Z')[0];
  
  return [
	  datePart,timePart
  ];
}