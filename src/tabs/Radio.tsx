import { Block, Card } from 'framework7-react';
import PlaybackBtn from '@/components/PlaybackBtn';
import useRadioPlayer from '@/hooks/useRadioPlayer';
import useSchedule from '@/hooks/useSchedule.ts';

const Radio = () => {
  const { icon, loading: radioLoading, togglePlayback } = useRadioPlayer();
  const { schedule, loading: scheduleLoading } = useSchedule();

  // Проверка загрузки расписания
  if (scheduleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Block>
      <Card>
        <PlaybackBtn icon={icon} disabled={radioLoading} onClick={togglePlayback} />
        <p>
          <b>{schedule?.current.time}</b>
          {schedule?.current.title}
        </p>
        <p>
          <b>{schedule?.next.time}</b>
          {schedule?.next.title}
        </p>
      </Card>
    </Block>
  );
};

export default Radio;
