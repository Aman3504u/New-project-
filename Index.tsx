import { useState } from 'react';
import LoveScene3D from '@/components/LoveScene3D';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-screen overflow-hidden">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <LoveScene3D />
      
    </div>
  );
};

export default Index;