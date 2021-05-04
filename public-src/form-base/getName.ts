
export function getName(v: any): string {
  const name = v.name;
  if (!name && typeof v == 'object') {
    const isRootList = 'length' in v;
    if (isRootList || v['element']) {
      const listParent = isRootList ? v : v['element'];
      return listParent.map(getName).join('|');
    }
  }
  return name;
}
