export default function ShellLoading() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          height: "1rem",
          width: "5rem",
          borderRadius: "999px",
          backgroundColor: "rgba(124, 80, 9, 0.15)",
        }}
      />
      <div
        style={{
          height: "2rem",
          width: "14rem",
          borderRadius: "1rem",
          backgroundColor: "rgba(124, 80, 9, 0.25)",
        }}
      />
      <div
        style={{
          height: "8rem",
          borderRadius: "1.5rem",
          backgroundColor: "rgba(29, 27, 24, 0.08)",
        }}
      />
    </div>
  );
}
