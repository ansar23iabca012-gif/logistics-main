import { useEffect, useState } from 'react';
import { seedDatabase } from '../../lib/seedData';

export default function DataInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if data has already been initialized
    const initialized = localStorage.getItem('data_initialized');

    if (!initialized) {
      // Initialize seed data
      seedDatabase().then((result) => {
        if (result.success) {
          console.log('✅ Database seeded successfully!');
          console.log('📊 Data:', result.data);
          localStorage.setItem('data_initialized', 'true');
          setIsInitialized(true);
        }
      });
    } else {
      setIsInitialized(true);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
