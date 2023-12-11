export function checkInteger(value: number) {
  const isInteger = typeof value === "number" && !isNaN(value) && Math.floor(value) === value;
  const isDecimal = value.toString().includes(".");
  const isPositive = value > 0;
  const isValid = isInteger && isPositive && !isDecimal;

  return isValid;
}