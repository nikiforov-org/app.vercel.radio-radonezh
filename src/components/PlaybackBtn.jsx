import { Button, Icon } from "framework7-react";

const PlaybackBtn = ({ icon, disabled, onClick }) => (
    <Button className="playbackBtn" disabled={disabled} onClick={onClick}>
        <Icon f7={icon} color="white" />
    </Button>
);

export default PlaybackBtn;
