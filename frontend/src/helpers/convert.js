const Capitals = (text) => {
  if (text.length > 0) {
    const Upper = `${text}`.substr(0, 1).toUpperCase();
    const Lower = `${text}`.substr(1).toLowerCase();
    return Upper + Lower;
  }
  return "";
};

const Rp = (angka) => {
  var rupiah = "";
  var angkarev = `${angka}`.toString().split("").reverse().join("");
  for (var i = 0; i < angkarev.length; i++)
    if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + ".";
  return (
    // "Rp. " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
};
const RpIndonesia = (angka) => {
  var rupiah = "";
  var angkarev = `${angka}`.toString().split("").reverse().join("");
  for (var i = 0; i < angkarev.length; i++)
    if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + ".";
  return (
    "Rp " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
};

function Price(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

const DataToTime = (value) => {
  let unix_timestamp = Date.parse(value);
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  //   var seconds = "0" + date.getSeconds();
  if (hours > 12) {
    let formattedTime = `${hours - 12}:${minutes.substr(-2)} pm`;
    return formattedTime;
  } else {
    let formattedTime = `${hours}:${minutes.substr(-2)} am`;
    return formattedTime;
  }
};

const DataToTimeout = (value) => {
  var date = new Date(value);

  // var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  return minutes.substr(-2);
};

const DateToTanggal = (value) => {
  console.log(value);
  var date = new Date(value);
  var tahun = date.getFullYear();
  var bulan = date.getMonth();
  var tanggal = date.getDate();
  var jam = date.getHours();
  var menit = date.getMinutes();
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
