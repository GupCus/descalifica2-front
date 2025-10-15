import Calendar21 from "@/components/calendar-21.tsx";

function Calendario() {
  return (
    <div className="flex flex-col items-center gap-6 py-10 px-4">
      <h1 className="text-4xl font-bold tracking-tight text-primary-foreground">
        Calendario F1 2025
      </h1>
      <Calendar21 />
    </div>
  );
}

export default Calendario;