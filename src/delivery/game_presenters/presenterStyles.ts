export const colors = {
  lightSage: "#c8f4cf",
  // lightSageTransparent: "rgb(200, 244, 207, 0.7)",
  lightSageTransparent: "#E7F8E7",
  strongRed: "#f57f7f",
  gray: "#cccccc",
  lightGray: "#efefef",
  // lightGrayTransparent: "rgb(239, 239, 239, 0.7)",
  lightGrayTransparent: "#F6F6F6",
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

export const tileGroup = {
  notCleared: {
    fill: colors.lightGrayTransparent,
    selected: colors.lightSageTransparent
  },
  cleared: {
    fill: colors.lightSageTransparent,
    selected: colors.lightGrayTransparent
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
