import { useMemo } from "react";
import NoteInput from "../components/NoteInput";
import { useAppContext } from "../context/AppContext";

export default function Home() {
  const { mode } = useAppContext();
  
  const bgUrl = useMemo(
    () =>
      mode
        ? "https://i.pinimg.com/originals/0b/e7/48/0be748204b77ec2211c3230442e468a9.gif"
        : "https://i.pinimg.com/originals/be/63/08/be63089e483cb06b226f6976723f5e5f.gif",
    [mode]
  );

  return (
    <div className="relative isolate w-full h-full min-h-[calc(100vh-4rem)] flex flex-col">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      <div id="Maincontent" className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <NoteInput />
        </div>
      </div>
    </div>
  );
}
