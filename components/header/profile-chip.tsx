import type { ProfileDisplayRecord } from "../../src/features/profiles/contracts/profile";

interface ProfileChipProps {
  profile: ProfileDisplayRecord;
}

export function ProfileChip({ profile }: ProfileChipProps) {
  const badgeLabel = profile.firstName.slice(0, 1).toUpperCase();

  return (
    <div
      data-testid="profile-chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.65rem",
        padding: "0.55rem 0.7rem 0.55rem 0.55rem",
        borderRadius: "999px",
        backgroundColor: "rgba(17, 109, 90, 0.1)",
        color: "#164f43",
        fontWeight: 700,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "1.8rem",
          height: "1.8rem",
          display: "inline-grid",
          placeItems: "center",
          borderRadius: "999px",
          backgroundColor: "#1b6f5c",
          color: "#fff7ed",
          fontSize: "0.82rem",
        }}
      >
        {badgeLabel}
      </span>
      <span>{profile.firstName}</span>
    </div>
  );
}
