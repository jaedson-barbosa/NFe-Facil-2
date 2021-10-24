export async function calcularIdImposto(imposto: any) {
  const texto = JSON.stringify(imposto)
  var buffer = new TextEncoder().encode(texto);
  const sha1 = await crypto.subtle.digest("SHA-1", buffer)
  return hex(sha1)
}

// https://8gwifi.org/docs/window-crypto-digest.jsp
function hex(buffer: ArrayBuffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
      // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
      var value = view.getUint32(i)
      // toString(16) will give the hex representation of the number without padding
      var stringValue = value.toString(16)
      // We use concatenation and slice for padding
      var padding = '00000000'
      var paddedValue = (padding + stringValue).slice(-padding.length)
      hexCodes.push(paddedValue);
  }
  // Join all the hex strings into one
  return hexCodes.join("");
}