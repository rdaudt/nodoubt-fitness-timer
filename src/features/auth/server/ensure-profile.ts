import type { SupabaseClient, User } from "@supabase/supabase-js";

import {
  toProfileDisplayRecord,
  type ProfileDisplayRecord,
  type ProfileRecord,
} from "../../profiles/contracts/profile";

interface ProfileRow {
  id: string;
  first_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

type ProfileCapableUser = Pick<User, "id" | "email" | "user_metadata">;

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toTitleCase(value: string) {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ");
}

function mapProfileRow(row: ProfileRow): ProfileRecord {
  return {
    id: row.id,
    firstName: row.first_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildFallbackProfile(
  userId: string,
  firstName: string | null,
  avatarUrl: string | null,
): ProfileDisplayRecord {
  return toProfileDisplayRecord({
    id: userId,
    firstName,
    avatarUrl,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  });
}

export function deriveFirstNameCandidate(
  metadata: Record<string, unknown> | null | undefined,
  email: string | null | undefined,
) {
  const givenName = normalizeOptionalString(metadata?.given_name);

  if (givenName) {
    return givenName;
  }

  const fullName = normalizeOptionalString(
    metadata?.full_name ?? metadata?.name,
  );

  if (fullName) {
    return fullName.split(/\s+/)[0] ?? fullName;
  }

  const emailName = normalizeOptionalString(email?.split("@")[0]);

  if (emailName) {
    return toTitleCase(emailName);
  }

  return null;
}

export function deriveProfileSeed(user: ProfileCapableUser) {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;

  return {
    id: user.id,
    firstName: deriveFirstNameCandidate(metadata, user.email),
    avatarUrl: normalizeOptionalString(
      metadata?.avatar_url ?? metadata?.picture ?? metadata?.photo_url,
    ),
  };
}

export async function ensureProfile(
  supabase: SupabaseClient,
  user: ProfileCapableUser,
) {
  const profileSeed = deriveProfileSeed(user);
  const fallbackProfile = buildFallbackProfile(
    user.id,
    profileSeed.firstName,
    profileSeed.avatarUrl,
  );

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("profiles")
    .select("id, first_name, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (existingProfileError) {
    return fallbackProfile;
  }

  if (existingProfile?.first_name?.trim()) {
    return toProfileDisplayRecord(mapProfileRow(existingProfile));
  }

  const { data: savedProfile, error: saveError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        first_name: existingProfile?.first_name?.trim() || profileSeed.firstName,
        avatar_url: existingProfile?.avatar_url ?? profileSeed.avatarUrl,
      },
      {
        onConflict: "id",
      },
    )
    .select("id, first_name, avatar_url, created_at, updated_at")
    .single<ProfileRow>();

  if (saveError || !savedProfile) {
    return fallbackProfile;
  }

  return toProfileDisplayRecord(mapProfileRow(savedProfile));
}
