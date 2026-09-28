import { USERNAME_RULES } from "./constants";

export interface BasicInfoValues {
  display_name?: string;
  username?: string;
}

export function validateBasicInfo(values: BasicInfoValues) {
  const name = (values.display_name ?? "").trim();
  const username = (values.username ?? "").trim();

  const errors: { displayName: string | null; username: string | null } = {
    displayName: null,
    username: null,
  };

  if (name.length < 2) {
    errors.displayName = "Add a name so people know who you are.";
  } else if (name.length > 40) {
    errors.displayName = "Keep your name under 40 characters.";
  }

  if (
    username.length < USERNAME_RULES.MIN_LENGTH ||
    username.length > USERNAME_RULES.MAX_LENGTH
  ) {
    errors.username = `Use ${USERNAME_RULES.MIN_LENGTH} to ${USERNAME_RULES.MAX_LENGTH} characters.`;
  } else if (!USERNAME_RULES.REGEX.test(username)) {
    errors.username = "Only letters, numbers and underscores.";
  }

  return { errors, isValid: !errors.displayName && !errors.username };
}