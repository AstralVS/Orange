const formatPriceVND = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
};

const formatLongString = (str, maxLength = 100) => {
    if (typeof str !== 'string') return '';
    if (str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}...`;
};

export { formatLongString, formatPriceVND };
