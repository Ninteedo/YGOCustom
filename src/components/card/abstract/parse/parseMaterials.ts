export function readMaterialsText(text: string): string | undefined {
  const res = text.match(/([^\n\r]+?)(?=(:?\r?\n| \/ ).+)/);
  if (!res) {
    if (text.includes(".")) {
      return undefined;
    }
    return text;
  }
  if (res[0].includes(".")) {
    return undefined;
  }
  return res[0];
}

export function readNonMaterialsText(text: string): string {
  const res = text.match(/(?<=([^\n\r/]+?)(\r?\n| \/ ))(.+)/s);
  if (!res) {
    if (text.includes(".")) {
      return text;
    }
    return "";
  }
  return res[0];
}
