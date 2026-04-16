import { getAuthContext } from "../../../src/features/auth/server/get-auth-context";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const authContext = await getAuthContext();

  return (
    <main
      style={{
        display: "grid",
        gap: "1rem",
      }}
    >
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
          Official library
        </p>
        <h1
          style={{
            margin: "0.35rem 0 0",
            fontSize: "2rem",
          }}
        >
          Templates
        </h1>
      </div>
      <p
        data-testid="templates-route-status"
        style={{
          margin: 0,
          color: "#5a544d",
        }}
      >
        {authContext.kind === "signed-in"
          ? `Signed in as ${authContext.profile.firstName}`
          : "Guests can browse official NoDoubt Fitness templates here."}
      </p>
      <section
        style={{
          borderRadius: "1.5rem",
          backgroundColor: "rgba(255, 255, 255, 0.74)",
          padding: "1.25rem",
          boxShadow: "0 24px 48px rgba(69, 40, 5, 0.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          Shell route ready
        </h2>
        <p style={{ marginBottom: 0, color: "#4f493f" }}>
          This route stays inside the shared mobile shell so template browsing
          keeps the same bottom navigation and safe-area framing as home.
        </p>
      </section>
    </main>
  );
}
