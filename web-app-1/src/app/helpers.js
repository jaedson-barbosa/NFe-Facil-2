export function createId(length = 20) {
  const AUTO_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return [...Array(length)]
    .map(() => {
      const index = Math.floor(Math.random() * AUTO_ID_CHARS.length);
      return AUTO_ID_CHARS.charAt(index);
    })
    .join('');
}