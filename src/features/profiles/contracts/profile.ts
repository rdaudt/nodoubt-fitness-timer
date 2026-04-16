export interface ProfileRecord {
  id: string;
  firstName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileDisplayRecord {
  id: string;
  firstName: string;
  avatarUrl: string | null;
}

export function toProfileDisplayRecord(
  profile: ProfileRecord,
): ProfileDisplayRecord {
  return {
    id: profile.id,
    firstName: profile.firstName?.trim() || "Athlete",
    avatarUrl: profile.avatarUrl,
  };
}
