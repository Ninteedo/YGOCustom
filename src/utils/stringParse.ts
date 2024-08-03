export function containsIgnoreQuotes(str: string, search: string): boolean {
  let inQuotes = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '"') {
      inQuotes = !inQuotes;
    }
    if (str.substring(i).startsWith(search) && !inQuotes) {
      return true;
    }
  }
  return false;
}

export function takeUntilIgnoreQuotes(str: string, search: string): string {
  let inQuotes = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '"') {
      inQuotes = !inQuotes;
    }
    if (str.substring(i).startsWith(search) && !inQuotes) {
      return str.substring(0, i);
    }
  }
  return str;
}
