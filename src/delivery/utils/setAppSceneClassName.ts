export default function(className: string): void {
  const topLevelEl = document.getElementById("app")!;
  topLevelEl.className = `app ${className}`;
}
