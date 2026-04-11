export default function Page() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-black">
      <iframe
        src="/game/index.html"
        title="Aryyzona Game"
        className="h-full w-full border-0"
        allow="autoplay; fullscreen"
      />
    </main>
  );
}
