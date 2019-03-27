
export default function(html: string): void {
  const topLevelEl = document.getElementById("app")!;
  const newDiv = topLevelEl.cloneNode(false) as HTMLElement;
  newDiv.innerHTML = html;
  topLevelEl.parentNode!.replaceChild(newDiv, topLevelEl);
}
