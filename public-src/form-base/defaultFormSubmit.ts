export function defaultFormSubmit(onSubmit: (data: any) => void, e: Event)
export function defaultFormSubmit(
  onSubmit: (data: any) => void,
  form: HTMLFormElement
)
export function defaultFormSubmit(
  onSubmit: (data: any) => void,
  param: Event | HTMLFormElement
) {
  let form: HTMLFormElement;
  if (param instanceof Event) {
    param.preventDefault();
    form = param.target as HTMLFormElement;
  } else {
    form = param;
  }
  var object = {};
  const formData = new FormData(form);
  const objectArrays: any[][] = [];
  formData.forEach(function (value, key) {
    if (!value)
      return;
    const path = key.split('.');
    let temp = object;
    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      const isLast = i === path.length - 1;
      if (isLast) {
        temp[p] = value;
      } else if (temp[p]) {
        temp = temp[p];
      } else {
        // se nao houver proximo ou se for alfabetico usa {}
        if (isNaN(+path[i + 1])) {
          temp = temp[p] = {};
        } else {
          const newArray = [];
          objectArrays.push(newArray);
          temp = temp[p] = newArray;
        }
      }
    }
  });
  objectArrays.forEach((v) => {
    let index = -1;
    while ((index = v.findIndex((v) => !v)) != -1) {
      v.splice(index, 1);
    }
  });
  onSubmit(object);
  return false;
}
