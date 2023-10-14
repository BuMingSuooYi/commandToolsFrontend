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