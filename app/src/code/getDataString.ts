export function toNFeString(data: Date) {
  const tzo = -data.getTimezoneOffset()
  const dif = tzo >= 0 ? '+' : '-'

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

function pad(num: number) {
  var norm = Math.floor(Math.abs(num))
  return (norm < 10 ? '0' : '') + norm
}
