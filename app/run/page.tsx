export default function RunPage() {
  return (
    <section
      data-testid="run-screen"
      style={{
        minHeight: "calc(100vh - 3rem)",
        borderRadius: "2rem",
        background:
          "linear-gradient(160deg, rgba(18, 18, 18, 0.96), rgba(46, 13, 8, 0.88))",
        color: "#fff7ed",
        padding: "2rem",
        display: "grid",
        alignContent: "center",
        gap: "1rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#f4b862",
        }}
      >
        Run Layout
      </p>
      <h1
        style={{
          margin: 0,
          fontSize: "2.5rem",
        }}
      >
        Full-screen playback placeholder
      </h1>
      <p
        style={{
          margin: 0,
          color: "rgba(255, 247, 237, 0.78)",
        }}
      >
        Phase 1 keeps this route outside the shell chrome so the later run
        engine can own the entire screen.
      </p>
    </section>
  );
}
