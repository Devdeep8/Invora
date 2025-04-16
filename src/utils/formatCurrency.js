/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: "INR")
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "INR") => {
  // Format the number with commas for thousands separator
  const formattedNumber = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Add the appropriate currency symbol
  switch (currency) {
    case "INR":
      return `₹ ${formattedNumber}`; // Unicode rupee symbol
    case "USD":
      return `$ ${formattedNumber}`;
    case "EUR":
      return `€ ${formattedNumber}`;
    case "GBP":
      return `£ ${formattedNumber}`;
    default:
      return `${currency} ${formattedNumber}`;
  }
};