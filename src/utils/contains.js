// 计算元素是否在数组内
 export default function (arr, obj) {  
    var i = arr.length;  
    while (i--) {  
      if (arr[i] === obj) {  
        return true;  
      }  
    }  
    return false;  
  };