export function createId() {
  const AUTO_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return [...Array(20)]
    .map(() => {
      const index = Math.floor(Math.random() * AUTO_ID_CHARS.length);
      return AUTO_ID_CHARS.charAt(index);
    })
    .join('');
}