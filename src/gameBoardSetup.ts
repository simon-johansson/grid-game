// r = regular
// f = flipped
// b = block

export const gameBoardLayouts: any = [
  {
    optimalMoves: 1,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"]
    ]
  },
  {
    optimalMoves: 2,
    layout: [
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"]
    ]
  },
  {
    optimalMoves: 3,
    layout: [
      ["b", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "b"]
    ]
  },
  {
    optimalMoves: 4,
    layout: [
      ["b", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "b"]
    ]
  },
  {
    optimalMoves: 3,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["f", "r", "r", "r", "f"],
      ["r", "f", "f", "f", "r"],
      ["r", "f", "f", "f", "r"]
    ]
  },
  {
    optimalMoves: 4,
    layout: [
      ["r", "r", "b", "r", "b"],
      ["r", "r", "b", "r", "b"],
      ["r", "f", "f", "f", "r"],
      ["r", "r", "r", "r", "b"],
      ["b", "b", "r", "b", "b"]
    ]
  },
  {
    optimalMoves: 7,
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["r", "b", "r", "b", "r"],
      ["r", "r", "r", "r", "r"]
    ]
  },
  {
    optimalMoves: 4,
    layout: [
      ["f", "r", "r", "r", "r"],
      ["r", "f", "r", "r", "r"],
      ["r", "r", "f", "r", "r"],
      ["r", "r", "r", "f", "r"],
      ["r", "r", "r", "r", "f"]
    ]
  },
  {
    optimalMoves: 6,
    layout: [
      ["r", "f", "r", "f", "r"],
      ["r", "r", "b", "r", "b"],
      ["r", "r", "f", "r", "r"],
      ["b", "r", "b", "r", "r"],
      ["r", "f", "r", "f", "r"]
    ]
  },
  {
    optimalMoves: 6,
    layout: [
      ["r", "f", "r", "f", "r"],
      ["r", "r", "b", "r", "r"],
      ["f", "b", "f", "r", "b"],
      ["r", "r", "f", "r", "b"],
      ["b", "f", "r", "f", "r"]
    ]
  }
];
