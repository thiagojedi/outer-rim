export const formDataToObject = (formData: FormData): Record<string, string> =>
  Object.fromEntries(
    formData.entries().filter((entry): entry is [string, string] =>
      typeof entry[1] === "string"
    ),
  );
