// interface IStyles {
//   [key: string]: string;
// }
// const styling: IStyles = {
//   "color": "red",
//   "font-size": "30px"
// }
// const styles = Object.keys(styling).map(key => `${key}: ${styling[key]};` ).join(' ');

export default class MovesLeft {
  public static render(selectionsLeft: number | undefined, selectionsMade: number): string {
    const wrapperID = 'moves-counter-wrapper'
    const counterID = 'moves-counter'

    const moves = selectionsLeft !== undefined ? selectionsLeft : selectionsMade;

    return `
      <h2 id="${wrapperID}">
        Moves: <span id="${counterID}">${moves}</span>
      </h2>
    `;
  }
}
