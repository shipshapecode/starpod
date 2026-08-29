export function truncate(str: string, length: number) {
  const sanitizedString = str.replace(/(<([^>]+)>)/gi, '');
  if (sanitizedString.length > length) {
    return `${sanitizedString.slice(0, length)}...`;
  } else return sanitizedString;
}
