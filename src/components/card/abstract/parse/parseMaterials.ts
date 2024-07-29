export function readMaterialsText(text: string): string | undefined {
  const res = text.match(/([^\n\r]+?)(?=(:?\r?\n| \/ ).+)/);
  if (res) {
    return res[0];
  }
}

export function readNonMaterialsText(text: string): string {
  const res = text.match(/(?<=([^\n\r/]+?)(\r?\n| \/ ))(.+)/s);
  return res ? res[0] : "";
}
