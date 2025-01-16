import {
  Application,
  Object as FederatedObject,
  Person,
  PropertyValue,
} from "@fedify/fedify";

export const formDataToObject = (formData: FormData): Record<string, string> =>
  Object.fromEntries(
    formData.entries().filter((entry): entry is [string, string] =>
      typeof entry[1] === "string"
    ),
  );

export const objectToMastodonAccount = async (
  handle: string,
  externalObject: FederatedObject,
) => {
  const person = externalObject as Person | Application;

  const url = person.url;

  const icon = person.getIcon();
  const image = person.getImage();

  const attachments: PropertyValue[] = [];
  for await (const item of person.getAttachments()) {
    attachments.push(item as PropertyValue);
  }

  const profile: Mastodon.Account = {
    id: person.id!.href,
    username: person.preferredUsername as string,
    display_name: person.name as string,
    created_at: person.published?.toString() ?? new Date().toString(),
    acct: handle.replace("@", ""),
    locked: person.manuallyApprovesFollowers ?? false,
    bot: externalObject instanceof Application,
    note: person.summary as string,
    group: false,
    discoverable: person.discoverable,
    url: (url?.href instanceof URL) ? url.href.href : url?.href ?? "",
    avatar: (await icon)?.url?.toString() ?? "",
    avatar_static: (await icon)?.url?.toString() ?? "",
    header: (await image)?.url?.toString() ?? "",
    header_static: (await image)?.url?.toString() ?? "",
    followers_count: 0,
    following_count: 0,
    statuses_count: 0,
    last_status_at: "",
    emojis: [],
    fields: attachments.map((property) => ({
      name: property.name?.toString() ?? "",
      value: property.value?.toString() ?? "",
      verified_at: null,
    })),
  };

  return profile;
};
