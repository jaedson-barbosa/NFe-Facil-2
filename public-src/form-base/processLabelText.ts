

export function processLabelText(documentation: string) {
  const text = documentation.startsWith('Informar campo')
    ? documentation
    : ['\n', '.', ':', ' - ', ', ', '(1', '(norma'].reduce(
      (p, c) => p.split(c)[0],
      documentation
    );
  return text.charAt(0).toUpperCase() + text.slice(1);
}
