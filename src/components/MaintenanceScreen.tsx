import { Loader2 } from "lucide-react";

const MaintenanceScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
      <h1 className="text-2xl text-white">Maintenance...</h1>
    </div>
  );
};

export default MaintenanceScreen;