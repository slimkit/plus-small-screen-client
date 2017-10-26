import storeLocal from 'store';

/**
 * 根据比例转换显示金额
 * @param  {[type]} amount [description]
 * @return {[type]}        [description]
 */
function showAmount (amount) {
  const ratio = storeLocal.get('ratio');
  return (amount * ratio / 10000).toFixed(2);
} 

/**
 * 将显示金额转换为真实金额
 * @param  {[type]} amount [description]
 * @return {[type]}        [description]
 */
function trueAmount (amount) {
  const ratio = storeLocal.get('ratio');
  return (amount * 10000 / ratio)
}

export {
  showAmount,
  trueAmount
}

