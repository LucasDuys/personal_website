export default function Home() {
  return (
    <main className="bg-[var(--bg)]">
      {[1, 2, 3, 4, 5].map((i) => (
        <section key={i} className="min-h-screen flex items-center justify-center">
          <p className="font-mono text-[var(--accent-green)] text-sm">
            <span className="opacity-60">$</span> section {i} / 5
          </p>
        </section>
      ))}
    </main>
  );
}
