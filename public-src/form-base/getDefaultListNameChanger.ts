
export function getDefaultListNameChanger(name: string) {
  return (v: string[]) => {
    v.splice(v.indexOf(name) + 1, 0, '0');
    return v;
  };
}
