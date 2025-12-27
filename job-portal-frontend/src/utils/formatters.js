export const formatSalary = (min, max) => {
    if (!min || !max) return "Not disclosed";

    const formatValue = (val) => {
        // If it's formatted as decimal string (e.g. "9.00"), parse it
        const num = parseFloat(val);
        if (isNaN(num)) return val;
        // Format: 9, 9.5, 10
        return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
    };

    return `₹${formatValue(min)}L - ₹${formatValue(max)}L`;
};
