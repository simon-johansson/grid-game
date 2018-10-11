export const getQueryStringParams = (query: string): any => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query).split("&").reduce((params: any, param) => {
        const [key, value] = param.split("=");
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
        return params;
      }, {})
    : {};
};

export const applyMixins = (derivedCtor: any, baseCtors: any[]) => {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
};

export const getTransitionSteps = (colorFrom: string, colorTo: string, steps: number) => {
  const stepList = [];
  const from = parseColor(colorFrom);
  const to = parseColor(colorTo);

  const stepAmountR = Math.floor((to.R - from.R) / steps);
  const stepAmountG = Math.floor((to.G - from.G) / steps);
  const stepAmountB = Math.floor((to.B - from.B) / steps);

  stepList.push(colorFrom);
  for (let i = 0; i <= steps; i++) {
    let minMax;
    // Red
    minMax = stepAmountR > 0 ? Math.min : Math.max;
    from.R = minMax(from.R + stepAmountR, to.R);

    // Green
    minMax = stepAmountG > 0 ? Math.min : Math.max;
    from.G = minMax(from.G + stepAmountG, to.G);

    // Blue
    minMax = stepAmountB > 0 ? Math.min : Math.max;
    from.B = minMax(from.B + stepAmountB, to.B);
    stepList.push(
      from.isHex ? rgbToHex(from.R, from.G, from.B) : "rgb(" + from.R + ", " + from.G + ", " + from.B + ")"
    );
  }
  stepList.push(colorTo);
  return stepList;
};

const parseColor = (color: string) => {
  const isHex = color.indexOf("#") != -1;
  if (isHex) {
    return { isHex: true, R: hexToR(color), G: hexToG(color), B: hexToB(color) };
  } else {
    const parsed = color
      .substring(4, color.length - 1)
      .replace(/ /g, "")
      .split(",");
    return {
      R: parseInt(parsed[0]),
      G: parseInt(parsed[1]),
      B: parseInt(parsed[2])
    };
  }
};

const hexToR = (h: string) => parseInt(cutHex(h).substring(0, 2), 16);
const hexToG = (h: string) => parseInt(cutHex(h).substring(2, 4), 16);
const hexToB = (h: string) => parseInt(cutHex(h).substring(4, 6), 16);
const cutHex = (h: string) => h.charAt(0) == "#" ? h.substring(1, 7) : h;

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
