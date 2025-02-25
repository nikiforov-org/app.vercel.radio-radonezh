import { Block, Card } from 'framework7-react';
import PlaybackBtn from '@/components/PlaybackBtn';
import useRadioPlayer from '@/hooks/useRadioPlayer';

const Radio = () => {
  const { icon, loading, togglePlayback } = useRadioPlayer();

  return (
    <Block>
      <Card>
        <PlaybackBtn icon={icon} disabled={loading} onClick={togglePlayback} />
      </Card>
    </Block>
  );
};

export default Radio;
