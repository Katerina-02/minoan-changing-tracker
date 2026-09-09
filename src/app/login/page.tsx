export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F6F8FA",
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        padding: 20,
      }}
    >
      <div
          style={{
            width: "100%",
            maxWidth: 360,
            background: "#FFFFFF",
            border: "1px solid #E0E6EB",
            borderRadius: 12,
            padding: "28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              height: 5,
              margin: "-28px -28px 20px",
              borderRadius: "12px 12px 0 0",
              background:
                "linear-gradient(90deg, #1868DB 0%, #1868DB 28%, #189A57 50%, #189A57 68%, #F2790A 100%)",
            }}
          />
          <h1 style={{ fontSize: 19, marginBottom: 4, fontFamily: "Georgia, serif" }}>
            Αλλαγές παροχών
          </h1>
          <div
            style={{
              fontStyle: "italic",
              fontSize: 13,
              color: "#5C6B77",
              marginBottom: 22,
            }}
          >
            Μινώα Ενεργειακή
          </div>
          <form method="POST" action="/api/login" style={{ textAlign: "left" }}>
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="email"
                style={{ display: "block", fontSize: 12, color: "#5C6B77", marginBottom: 6 }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoFocus
                autoComplete="username"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #E0E6EB",
                  borderRadius: 6,
                  padding: "9px 11px",
                  fontSize: 14,
                }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label
                htmlFor="password"
                style={{ display: "block", fontSize: 12, color: "#5C6B77", marginBottom: 6 }}
              >
                Κωδικός πρόσβασης
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #E0E6EB",
                  borderRadius: 6,
                  padding: "9px 11px",
                  fontSize: 14,
                }}
              />
            </div>
            {error && (
              <div style={{ fontSize: 11.5, color: "#D64545", marginBottom: 10 }}>
                Λάθος email ή κωδικός — δοκίμασε ξανά.
              </div>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: 6,
                padding: 11,
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                borderRadius: 6,
                background: "#189A57",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Είσοδος
            </button>
          </form>
      </div>
    </div>
  );
}
