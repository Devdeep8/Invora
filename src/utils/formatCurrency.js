export const formatCurrency = (amount, currency = "INR") => {
  const num = Number(amount);
  const safeAmount = isNaN(num) ? 0 : num;
  const isNegative = safeAmount < 0;
  const absoluteAmount = Math.abs(safeAmount);

  const formattedNumber = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absoluteAmount);

  let symbol = '';
  switch (currency) {
    case "INR":
      symbol = '₹';
      break;
    case "USD":
      symbol = '$';
      break;
    case "EUR":
      symbol = '€';
      break;
    case "GBP":
      symbol = '£';
      break;
    default:
      symbol = currency;
  }

  return `${isNegative ? '-' : ''}${symbol}${formattedNumber}`;
};
