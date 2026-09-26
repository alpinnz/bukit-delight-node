const Capitals = (text: string): string => {
  if (text.length > 0) {
    const Upper = text.substr(0, 1).toUpperCase();
    const Lower = text.substr(1).toLowerCase();
    return Upper + Lower;
  }
  return "";
};

const Rp = (angka: number | string): string => {
  let rupiah = "";
  const angkarev = `${angka}`.toString().split("").reverse().join("");
  for (let i = 0; i < angkarev.length; i++)
    if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + ".";
  return rupiah
    .split("", rupiah.length - 1)
    .reverse()
    .join("");
};

const RpIndonesia = (angka: number | string): string => {
  let rupiah = "";
  const angkarev = `${angka}`.toString().split("").reverse().join("");
  for (let i = 0; i < angkarev.length; i++)
    if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + ".";
  return (
    "Rp " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
};

function Price(num: number): string | number {
  return Math.abs(num) > 999
    ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + "k"
    : Math.sign(num) * Math.abs(num);
}

const DataToTime = (value: string): string => {
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

const DataToTimeout = (value: string | number | Date): string => {
  const date = new Date(value);
  const minutes = "0" + date.getMinutes();
  return minutes.substr(-2);
};

const DateToTanggal = (value: string | number | Date): string => {
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

const Convert = {
  RpIndonesia,
  Capitals,
  Rp,
  Price,
  DataToTime,
  DataToTimeout,
  DateToTanggal,
};

export default Convert;
