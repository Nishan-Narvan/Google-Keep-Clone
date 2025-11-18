import NoteInput from "../components/NoteInput";

function Home({ mode, notes, setNotes, setArchieved, setTrashed }) {
  const bgUrl = mode
    ? "https://i.pinimg.com/originals/0b/e7/48/0be748204b77ec2211c3230442e468a9.gif"
    : "https://i.pinimg.com/originals/be/63/08/be63089e483cb06b226f6976723f5e5f.gif";

  return (
    <div className="relative isolate w-full flex-1 min-h-[calc(100vh-4rem)]">
      {/* Background inside the Home container */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      <div
        id="Maincontent"
        className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8"
      >
        <NoteInput
          mode={mode}
          notes={notes}
          setNotes={setNotes}
          setArchieved={setArchieved}
          setTrashed={setTrashed}
        />
      </div>
    </div>
  );
}

export default Home;
