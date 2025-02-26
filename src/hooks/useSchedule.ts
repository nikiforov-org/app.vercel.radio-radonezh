import { useEffect, useState } from 'react';
import viteEnv from '@/utils/viteEnv';

interface ScheduleData {
  current: {
    time: string;
    title: string;
  };
  next: {
    time: string;
    title: string;
  };
}

const useSchedule = (): { schedule: ScheduleData | null; loading: boolean } => {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const [useEdgeConfig, api, edgeConfigUri, edgeConfigId, edgeConfigToken] = viteEnv([
      'VITE_USE_EDGE_CONFIG',
      'VITE_API',
      'VITE_EDGE_CONFIG_URI',
      'VITE_EDGE_CONFIG_ID',
      'VITE_EDGE_CONFIG_TOKEN',
    ]);

    const fetchSchedule = async (): Promise<void> => {
      try {
        const response = await fetch(
          useEdgeConfig === '1'
            ? `${edgeConfigUri}/${edgeConfigId}/item/schedule?token=${edgeConfigToken}`
            : api,
        );
        // Явно указываем, что результат JSON неизвестного типа
        const jsonData: unknown = await response.json();
        // Приводим результат к типу ScheduleData
        const data = jsonData as ScheduleData;
        setSchedule(data);
      } catch (error) {
        console.error('Ошибка при получении расписания', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchSchedule();

    const interval = setInterval(() => {
      void fetchSchedule();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { schedule, loading };
};

export default useSchedule;
