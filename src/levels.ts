import { IGameLevel } from "./Logic/boundaries";

// r = regular
// f = flipped
// b = block

export const gameBoardLayouts: IGameLevel[] = [
  {
    moves: 1,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"]
    ]
  },
  {
    moves: 2,
    layout: [
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"]
    ]
  },
  {
    moves: 3,
    layout: [
      ["b", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "b"]
    ]
  },
  {
    moves: 4,
    layout: [
      ["b", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "b"]
    ]
  },
  {
    moves: 3,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["f", "r", "r", "r", "f"],
      ["r", "f", "f", "f", "r"],
      ["r", "f", "f", "f", "r"]
    ]
  },
  {
    moves: 4,
    layout: [
      ["r", "r", "b", "r", "b"],
      ["r", "r", "b", "r", "b"],
      ["r", "f", "f", "f", "r"],
      ["r", "r", "r", "r", "b"],
      ["b", "b", "r", "b", "b"]
    ]
  },
  {
    moves: 7,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "b", "r", "b", "r"],
      ["r", "r", "r", "r", "r"]
    ]
  },
  {
    moves: 4,
    layout: [
      ["f", "r", "r", "r", "r"],
      ["r", "f", "r", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "r", "f", "r"],
      ["r", "r", "r", "r", "f"]
    ]
  },
  {
    moves: 6,
    layout: [
      ["r", "f", "r", "f", "r"],
      ["r", "r", "b", "r", "b"],
      ["r", "r", "f", "r", "r"],
      ["b", "r", "b", "r", "r"],
      ["r", "f", "r", "f", "r"]
    ]
  },
  {
    moves: 6,
    layout: [
      ["r", "f", "r", "f", "r"],
      ["r", "r", "b", "r", "r"],
      ["f", "b", "f", "r", "b"],
      ["r", "r", "f", "r", "b"],
      ["b", "f", "r", "f", "r"]
    ]
  },
  {
    moves: 4,
    layout: [
      ["r", "b", "r", "r", "r"],
      ["f", "r", "f", "f", "f"],
      ["f", "r", "r", "r", "r"],
      ["r", "f", "f", "f", "f"],
      ["f", "r", "r", "r", "r"]
    ]
  },
  {
    moves: 4,
    layout: [
      ["r", "r", "f", "r", "r"],
      ["f", "f", "r", "f", "r"],
      ["f", "f", "r", "f", "r"],
      ["r", "r", "f", "r", "f"],
      ["r", "r", "r", "b", "r"]
    ]
  },
  {
    moves: 4,
    layout: [
      ["r", "r", "r", "r", "b"],
      ["f", "r", "f", "f", "r"],
      ["r", "r", "f", "b", "f"],
      ["r", "f", "r", "r", "r"],
      ["f", "r", "r", "r", "r"]
    ]
  },
  {
    moves: 5,
    layout: [
      ["r", "b", "r", "r", "r"],
      ["f", "r", "f", "f", "f"],
      ["f", "r", "r", "r", "f"],
      ["r", "r", "r", "r", "b"],
      ["f", "r", "r", "r", "r"]
    ]
  },
  {
    moves: 3,
    layout: [
      ["r", "f", "f", "r", "f"],
      ["r", "r", "r", "f", "r"],
      ["r", "f", "f", "r", "f"],
      ["r", "f", "f", "r", "f"],
      ["b", "r", "r", "f", "f"]
    ]
  },
  {
    moves: 3,
    layout: [
      ["r", "f", "f", "r", "r"],
      ["r", "f", "f", "r", "r"],
      ["r", "f", "r", "f", "f"],
      ["f", "r", "f", "f", "f"],
      ["f", "f", "r", "r", "r"]
    ]
  },
  {
    moves: 4,
    layout: [
      ["r", "r", "f", "r", "r"],
      ["f", "f", "r", "f", "r"],
      ["r", "r", "f", "r", "b"],
      ["r", "f", "r", "f", "r"],
      ["b", "b", "r", "b", "b"]
    ]
  },
  {
    moves: 3,
    layout: [
      ["b", "r", "r", "b", "b"],
      ["b", "r", "f", "r", "r"],
      ["r", "f", "r", "f", "r"],
      ["r", "f", "f", "r", "b"],
      ["r", "r", "r", "r", "b"]
    ]
  },
  {
    moves: 3,
    layout: [
      ["r", "r", "f", "f", "r"],
      ["b", "b", "r", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "r", "b", "b"]
    ]
  },
  {
    moves: 3,
    layout: [
      ["r", "r", "r", "b", "b"],
      ["r", "r", "r", "b", "b"],
      ["r", "f", "r", "f", "r"],
      ["r", "r", "f", "r", "b"],
      ["b", "b", "r", "r", "b"]
    ]
  },
  {
    moves: 9,
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
    moves: 3,
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
