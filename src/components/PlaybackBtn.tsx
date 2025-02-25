import React from 'react';
import { Button, Icon } from 'framework7-react';

interface PlaybackBtnProps {
  icon: string;
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: unknown; // Разрешаем любые дополнительные пропсы
}

const PlaybackBtn: React.FC<PlaybackBtnProps> = ({ ...props }) => {
  return (
    <Button className="playbackBtn" disabled={props.disabled} onClick={props.onClick} {...props}>
      <Icon f7={props.icon} color="white" />
    </Button>
  );
};

export default PlaybackBtn;
