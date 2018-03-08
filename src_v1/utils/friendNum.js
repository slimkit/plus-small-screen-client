function friendNum (num) {
    if(num < 1000) {
       return num;
    } else if(num >=1000 && num < 1000000){
       return Math.round(num / 1000 * 100) / 100 + 'k';
    } else if (num >= 1000000) {
       return Math.round(num / 1000000 * 100) / 100 + 'm';
    }
};

export {
  friendNum
};
