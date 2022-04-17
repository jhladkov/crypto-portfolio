export const usePercentProfit = (holdTokens, avg, profit) => {
  const initSpendMoney = +holdTokens * +avg;
  return ((profit * 100) / initSpendMoney).toFixed(2);
};
