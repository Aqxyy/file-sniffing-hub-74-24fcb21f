import { Loader2 } from "lucide-react";

const MaintenanceScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <h1 className="text-3xl font-bold text-white">Maintenance...</h1>
      </div>
    </div>
  );
};

export default MaintenanceScreen;