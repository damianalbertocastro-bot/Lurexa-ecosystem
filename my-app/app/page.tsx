import { Button } from "@lurexa/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Hello from Lurexa!</h1>
      {/* Passing the appName prop fixes the undefined message */}
      <Button appName="Lurexa">Click Shared Workspace Component</Button>
    </div>
  );
}