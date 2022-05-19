export const usePercentProfit = (holdTokens, avg, profit) => {
  if (holdTokens && avg && profit) {
    const initSpendMoney = +holdTokens * +avg;
    return ((profit * 100) / initSpendMoney).toFixed(2);
  }
  return 0;
};
