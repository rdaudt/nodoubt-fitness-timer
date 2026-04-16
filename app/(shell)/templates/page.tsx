import { OfficialTemplatesSection } from "../../../components/home/official-templates-section";
import { ProfileChip } from "../../../components/header/profile-chip";
import { getHomeViewModel } from "../../../src/features/home/server/get-home-view-model";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const viewModel = await getHomeViewModel();
  const officialTemplatesSection = viewModel.sections.find(
    (section) => section.kind === "official-templates",
  );

  return (
    <section
      style={{
        display: "grid",
        gap: "1.25rem",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <p
            data-testid="auth-status"
            style={{
              display: "inline-flex",
              margin: 0,
              padding: "0.35rem 0.65rem",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              backgroundColor:
                viewModel.auth.kind === "signed-in"
                  ? "rgba(27, 111, 92, 0.13)"
                  : "rgba(140, 92, 22, 0.12)",
              color:
                viewModel.auth.kind === "signed-in" ? "#1b6f5c" : "#8c5c16",
            }}
          >
            {viewModel.authStatusLabel}
          </p>
          <h1
            style={{
              margin: "0.45rem 0 0",
              fontSize: "2rem",
            }}
          >
            Official Templates
          </h1>
        </div>
        {viewModel.profile ? (
          <ProfileChip profile={viewModel.profile} />
        ) : null}
      </header>
      <p
        style={{
          margin: 0,
          color: "#5a544d",
        }}
      >
        Browse the public No Doubt Fitness starters without leaving the shared
        shell.
      </p>
      {officialTemplatesSection ? (
        <OfficialTemplatesSection section={officialTemplatesSection} />
      ) : (
        <p
          style={{
            margin: 0,
            color: "#5a544d",
          }}
        >
          Official templates are temporarily unavailable.
        </p>
      )}
    </section>
  );
}
