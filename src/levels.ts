import { IGameLevel } from "./Logic/boundaries";

// r = regular
// f = flipped
// b = block

export const gameBoardLayouts: IGameLevel[] = [
  {
    numberOfSelections: 1,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"]
    ]
  },
  {
    numberOfSelections: 2,
    layout: [
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"]
    ]
  },
  {
    numberOfSelections: 3,
    layout: [
      ["b", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "b"]
    ]
  },
  {
    numberOfSelections: 4,
    layout: [
      ["b", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "b"]
    ]
  },
  {
    numberOfSelections: 3,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["f", "r", "r", "r", "f"],
      ["r", "f", "f", "f", "r"],
      ["r", "f", "f", "f", "r"]
    ]
  },
  {
    numberOfSelections: 4,
    layout: [
      ["r", "r", "b", "r", "b"],
      ["r", "r", "b", "r", "b"],
      ["r", "f", "f", "f", "r"],
      ["r", "r", "r", "r", "b"],
      ["b", "b", "r", "b", "b"]
    ]
  },
  {
    numberOfSelections: 7,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "b", "r", "b", "r"],
      ["r", "r", "r", "r", "r"]
    ]
  },
  {
    numberOfSelections: 4,
    layout: [
      ["f", "r", "r", "r", "r"],
      ["r", "f", "r", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "r", "f", "r"],
      ["r", "r", "r", "r", "f"]
    ]
  },
  {
    numberOfSelections: 6,
    layout: [
      ["r", "f", "r", "f", "r"],
      ["r", "r", "b", "r", "b"],
      ["r", "r", "f", "r", "r"],
      ["b", "r", "b", "r", "r"],
      ["r", "f", "r", "f", "r"]
    ]
  },
  {
    numberOfSelections: 6,
    layout: [
      ["r", "f", "r", "f", "r"],
      ["r", "r", "b", "r", "r"],
      ["f", "b", "f", "r", "b"],
      ["r", "r", "f", "r", "b"],
      ["b", "f", "r", "f", "r"]
    ]
  },
  {
    numberOfSelections: 4,
    layout: [
      ["r", "b", "r", "r", "r"],
      ["f", "r", "f", "f", "f"],
      ["f", "r", "r", "r", "r"],
      ["r", "f", "f", "f", "f"],
      ["f", "r", "r", "r", "r"]
    ]
  },
  {
    numberOfSelections: 4,
    layout: [
      ["r", "r", "f", "r", "r"],
      ["f", "f", "r", "f", "r"],
      ["f", "f", "r", "f", "r"],
      ["r", "r", "f", "r", "f"],
      ["r", "r", "r", "b", "r"]
    ]
  },
  {
    numberOfSelections: 4,
    layout: [
      ["r", "r", "r", "r", "b"],
      ["f", "r", "f", "f", "r"],
      ["r", "r", "f", "b", "f"],
      ["r", "f", "r", "r", "r"],
      ["f", "r", "r", "r", "r"]
    ]
  },
  {
    numberOfSelections: 5,
    layout: [
      ["r", "b", "r", "r", "r"],
      ["f", "r", "f", "f", "f"],
      ["f", "r", "r", "r", "f"],
      ["r", "r", "r", "r", "b"],
      ["f", "r", "r", "r", "r"]
    ]
  },
  {
    numberOfSelections: 3,
    layout: [
      ["r", "f", "f", "r", "f"],
      ["r", "r", "r", "f", "r"],
      ["r", "f", "f", "r", "f"],
      ["r", "f", "f", "r", "f"],
      ["b", "r", "r", "f", "f"]
    ]
  },
  {
    numberOfSelections: 3,
    layout: [
      ["r", "f", "f", "r", "r"],
      ["r", "f", "f", "r", "r"],
      ["r", "f", "r", "f", "f"],
      ["f", "r", "f", "f", "f"],
      ["f", "f", "r", "r", "r"]
    ]
  },
  {
    numberOfSelections: 4,
    layout: [
      ["r", "r", "f", "r", "r"],
      ["f", "f", "r", "f", "r"],
      ["r", "r", "f", "r", "b"],
      ["r", "f", "r", "f", "r"],
      ["b", "b", "r", "b", "b"]
    ]
  },
  {
    numberOfSelections: 3,
    layout: [
      ["b", "r", "r", "b", "b"],
      ["b", "r", "f", "r", "r"],
      ["r", "f", "r", "f", "r"],
      ["r", "f", "f", "r", "b"],
      ["r", "r", "r", "r", "b"]
    ]
  },
  {
    numberOfSelections: 3,
    layout: [
      ["r", "r", "f", "f", "r"],
      ["b", "b", "r", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "r", "b", "b"]
    ]
  },
  {
    numberOfSelections: 3,
    layout: [
      ["r", "r", "r", "b", "b"],
      ["r", "r", "r", "b", "b"],
      ["r", "f", "r", "f", "r"],
      ["r", "r", "f", "r", "b"],
      ["b", "b", "r", "r", "b"]
    ]
  },
  {
    numberOfSelections: 9,
    rules: {
      minSelection: 4
    },
    layout: [
      ["r", "r", "b", "b", "b"],
      ["r", "r", "r", "r", "b"],
      ["b", "r", "r", "r", "b"],
      ["b", "r", "r", "r", "r"],
      ["b", "b", "b", "r", "r"]
    ]
  },
  {
    numberOfSelections: 3,
    rules: {
      minSelection: 4
    },
    layout: [
      ["r", "r", "r", "b", "b"],
      ["r", "r", "r", "b", "b"],
      ["r", "r", "r", "r", "r"],
      ["b", "b", "r", "r", "r"],
      ["b", "b", "r", "r", "r"]
    ]
  }
];
