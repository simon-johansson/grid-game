export default function debounce(func: () => void, wait: number): () => void {
  let timeout: number | undefined;
  return (...args: any) => {
    const later = () => {
      timeout = undefined;
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
