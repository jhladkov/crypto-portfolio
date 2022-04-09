export const numberFormater = (number, decimals, dec_point, thousands_sep, fiat) => {
  if (dec_point === undefined) {
    dec_point = ',';
  }
  if (thousands_sep === undefined) {
    thousands_sep = '.';
  }

  const i = `${Number.parseInt(number = (+number || 0).toFixed(decimals), 10)}`;
  let j = i.length;

  if (j > 3) {
    j %= 3;
  } else {
    j = 0;
  }

  const km = (j ? i.substr(0, j) + thousands_sep : '');
  const kw = i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands_sep}`);
  const kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : '');

  return fiat + km + kw + kd;
};
