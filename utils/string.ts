export const $string = (value: string) => ({
  afterLast(indentifier: string) {
    const index = value.lastIndexOf(indentifier);
    return index === -1 ? value : value.substring(index + 1);
  },
  replaceEmpty(replacement: string) {
    if (!value || value.trim() === '') {
      return replacement;
    }

    return value;
  }
})
