export const colors = {
  lightSage: "#c8f4cf",
  strongRed: "#f57f7f",
  gray: "#cccccc",
  lightGray: "#efefef",
  whiteTransparent: "rgba(255, 255, 255, 0.24)",
};

export const tileFlippable = {
  notCleared: {
    fill: colors.lightGray,
    selected: colors.lightSage
  },
  cleared: {
    fill: colors.lightSage,
    selected: colors.lightGray
  }
};

export const selection = {
  fill: colors.whiteTransparent,
  valid: {
    stroke: colors.gray,
  },
  invalid: {
    stroke: colors.strongRed,
  }
};
