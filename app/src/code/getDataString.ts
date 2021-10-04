export function toNFeString(data: Date) {
  var tzo = -data.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
      var norm = Math.floor(Math.abs(num))
      return (norm < 10 ? '0' : '') + norm
    }
  return (
    data.getFullYear() +
    '-' +
    pad(data.getMonth() + 1) +
    '-' +
    pad(data.getDate()) +
    'T' +
    pad(data.getHours()) +
    ':' +
    pad(data.getMinutes()) +
    ':' +
    pad(data.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  )
}
