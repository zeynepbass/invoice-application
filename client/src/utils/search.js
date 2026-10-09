const normalize = (value) => String(value ?? "").toLocaleLowerCase("tr-TR");

export const matchesSearch = (query, ...fields) => {
  const needle = normalize(query).trim();
  return !needle || fields.some((field) => normalize(field).includes(needle));
};
