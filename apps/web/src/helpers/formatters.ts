const capitalizeText = (text: string): string => {
  if (text.length > 0) {
    const firstCharacter = text.substr(0, 1).toUpperCase();
    const remainingText = text.substr(1).toLowerCase();
    return firstCharacter + remainingText;
  }
  return "";
};

const formatRupiah = (amount: number | string): string => {
  let rupiah = "";
  const reversedAmount = `${amount}`.split("").reverse().join("");
  for (let index = 0; index < reversedAmount.length; index++)
    if (index % 3 === 0) rupiah += reversedAmount.substr(index, 3) + ".";
  return rupiah
    .split("", rupiah.length - 1)
    .reverse()
    .join("");
};

const formatIndonesianRupiah = (amount: number | string): string => {
  let rupiah = "";
  const reversedAmount = `${amount}`.split("").reverse().join("");
  for (let index = 0; index < reversedAmount.length; index++)
    if (index % 3 === 0) rupiah += reversedAmount.substr(index, 3) + ".";
  return (
    "Rp " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
};

function formatCompactPrice(amount: number): string | number {
  return Math.abs(amount) > 999
    ? Math.sign(amount) * Number((Math.abs(amount) / 1000).toFixed(1)) + "k"
    : Math.sign(amount) * Math.abs(amount);
}

const formatTime = (value: string): string => {
  const unix_timestamp = Date.parse(value);
  const date = new Date(unix_timestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  if (hours > 12) {
    const formattedTime = `${hours - 12}:${minutes.substr(-2)} pm`;
    return formattedTime;
  } else {
    const formattedTime = `${hours}:${minutes.substr(-2)} am`;
    return formattedTime;
  }
};

const formatMinutes = (value: string | number | Date): string => {
  const date = new Date(value);
  const minutes = "0" + date.getMinutes();
  return minutes.substr(-2);
};

const formatIndonesianDateTime = (value: string | number | Date): string => {
  console.log(value);
  const date = new Date(value);
  const tahun = date.getFullYear();
  const bulan = date.getMonth();
  const tanggal = date.getDate();
  const jam = date.getHours();
  const menit = date.getMinutes();
  if (jam > 12) {
    return `${tanggal}/${bulan + 1}/${tahun} ${jam - 12}:${menit} pm`;
  } else {
    return `${tanggal}/${bulan + 1}/${tahun} ${jam}:${menit} am`;
  }
};

const formatters = {
  formatIndonesianRupiah,
  capitalizeText,
  formatRupiah,
  formatCompactPrice,
  formatTime,
  formatMinutes,
  formatIndonesianDateTime,
};

export default formatters;
