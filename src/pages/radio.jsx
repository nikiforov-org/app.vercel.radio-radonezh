import { useState, useEffect, useRef } from "react";
import { Block, Card } from "framework7-react";
import PlaybackBtn from "@/components/PlaybackBtn";

const Radio = () => {
    const [icon, setIcon] = useState("arrow_2_circlepath");
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio("https://icecast-radonezh.cdnvideo.ru/rad128"));

    useEffect(() => {
        const audio = audioRef.current;

        const onCanPlay = () => {
            setLoading(false);
            setIcon("play_fill");
        };

        const onError = () => {
            setLoading(false);
            setIcon("xmark_circle"); // Ошибка загрузки
        };

        audio.addEventListener("canplay", onCanPlay);
        audio.addEventListener("error", onError);

        return () => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("error", onError);
        };
    }, []);

    const togglePlayback = () => {
        const audio = audioRef.current;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            setIcon(loading ? "arrow_2_circlepath" : "play_fill");
        } else {
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                    setIcon("pause_fill");
                })
                .catch(() => {
                    setIsPlaying(false);
                    setIcon("arrow_2_circlepath");
                });
        }
    };

    return (
        <Block>
            <Card>
                <PlaybackBtn icon={icon} disabled={loading} onClick={togglePlayback} />
            </Card>
        </Block>
    );
};

export default Radio;
