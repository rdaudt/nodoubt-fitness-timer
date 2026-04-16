import { GoogleSignInButton } from "../../src/features/auth/components/google-sign-in-button";
import type {
  HomeViewModel,
  OfficialTemplatesSection,
  PersonalTimerSummarySection,
} from "../../src/features/home/server/get-home-view-model";
import { ProfileChip } from "../header/profile-chip";
import { MyTimersSection } from "./my-timers-section";
import { OfficialTemplatesSection as OfficialTemplatesSectionView } from "./official-templates-section";

interface HomeScreenProps {
  viewModel: HomeViewModel;
}

function renderSection(
  section: HomeViewModel["sections"][number],
) {
  if (section.kind === "my-timers") {
    return <MyTimersSection section={section as PersonalTimerSummarySection} />;
  }

  return (
    <OfficialTemplatesSectionView
      section={section as OfficialTemplatesSection}
    />
  );
}

export function HomeScreen({ viewModel }: HomeScreenProps) {
  return (
    <section
      data-testid="home-screen"
      style={{
        display: "grid",
        gap: "1.5rem",
      }}
    >
      <header
        style={{
          display: "grid",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "0.55rem",
            }}
          >
            <p
              data-testid="auth-status"
              style={{
                display: "inline-flex",
                width: "fit-content",
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
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8c5c16",
                }}
              >
                No Doubt Fitness Timer
              </p>
              <h1
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "2rem",
                  lineHeight: 1.05,
                }}
              >
                {viewModel.heading}
              </h1>
            </div>
          </div>
          {viewModel.profile ? <ProfileChip profile={viewModel.profile} /> : null}
        </div>
        <div
          style={{
            display: "grid",
            gap: "0.85rem",
            padding: "1.1rem",
            borderRadius: "1.5rem",
            background:
              "linear-gradient(145deg, rgba(255, 248, 240, 0.96), rgba(245, 224, 196, 0.92))",
            border: "1px solid rgba(140, 92, 22, 0.14)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#433d35",
            }}
          >
            {viewModel.description}
          </p>
          {viewModel.email ? (
            <p
              data-testid="signed-in-email"
              style={{
                margin: 0,
                color: "#5a544d",
                fontWeight: 600,
              }}
            >
              {viewModel.email}
            </p>
          ) : null}
          {viewModel.showGoogleSignIn ? (
            <div
              style={{
                display: "grid",
                gap: "0.65rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#5a544d",
                }}
              >
                Keep browsing now, then sign in only when you want saved timers
                to follow you back.
              </p>
              <GoogleSignInButton />
            </div>
          ) : null}
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
        }}
      >
        {viewModel.sections.map((section) => (
          <div key={section.kind}>{renderSection(section)}</div>
        ))}
      </div>
    </section>
  );
}
