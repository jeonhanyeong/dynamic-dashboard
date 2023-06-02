import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import ActionTools from './ActionTools';

const CardBoard = styled.div`
  border: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  box-sizing: border-box;
  padding: 10px;
  background-color: ${(props) => props.theme.bgColor};
  position: absolute;
  border-radius: 2px;

  transition: height 125ms linear 125ms, width 125ms linear 0s, top 175ms ease-out, left 175ms ease-out,
    right 175ms ease-out;
  z-index: 991;
  min-height: 84px;
  min-width: 84px;
`;

interface CardPosition {
  topPx: number;
  leftPx: number;
  widthPx: number;
  heightPx: number;
  name: string;
  displayState: string;
  isPreview: boolean;
  handleDelete: ((event: React.MouseEvent) => void) | null;
  handleContext: ((name: string, ratioWidth: number, ratioHeight: number) => void) | null;
  isDarkMode: boolean;
}

interface TimeInfo {
  year: number;
  month: string;
  day: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const ServerTime = ({
  isDarkMode,
  topPx,
  name,
  leftPx,
  widthPx,
  heightPx,
  displayState,
  isPreview,
  handleDelete,
  handleContext,
}: CardPosition) => {
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(991);

  const [timer, setTimer] = useState<TimeInfo>({
    year: 0,
    month: '0',
    day: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  });
  const [fontRatio, setFontRatio] = useState(0);

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };

  const currentTimer = () => {
    const date = new Date();
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // 12시간 형식으로 변경
    hours = hours % 12 || 12;

    const updateCurrentTime = { ...timer };
    updateCurrentTime.year = date.getFullYear();
    updateCurrentTime.month = String(date.getMonth() + 1).padStart(2, '0');
    updateCurrentTime.day = String(date.getDate()).padStart(2, '0');
    updateCurrentTime.hours = String(date.getHours()).padStart(2, '0');
    updateCurrentTime.minutes = String(date.getMinutes()).padStart(2, '0');
    updateCurrentTime.seconds = String(date.getSeconds()).padStart(2, '0');
    setTimer(updateCurrentTime);
  };

  const startTimer = () => {
    setInterval(currentTimer, 1000);
  };
  startTimer();

  useEffect(() => {
    setFontRatio(Math.floor(widthPx / 6));
  }, [widthPx]);
  return (
    <CardBoard
      ref={cardBoardRef}
      className={name}
      key={name}
      style={{
        top: topPx,
        left: leftPx,
        width: widthPx,
        height: heightPx,
        display: displayState,
        cursor: isPreview ? 'auto' : 'move',
        zIndex: depth,
      }}
      draggable
    >
      {isPreview ? null : (
        <ActionTools
          name={name}
          handleDelete={handleDelete}
          handleSelectCard={handleSelectCard}
          handleContext={handleContext}
        />
      )}

      <div
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000', fontSize: fontRatio / 3.5 }}> 대한민국 표준시 </span>
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000', fontSize: fontRatio, marginBottom: '10px' }}>
          <strong>{`${timer.hours}:${timer.minutes}:${timer.seconds}`}</strong>
        </span>
        <span
          style={{ color: isDarkMode ? 'lightgray' : 'gray', fontSize: fontRatio / 3.5 }}
        >{`${timer.year}년 ${timer.month}월 ${timer.day}일`}</span>
      </div>
    </CardBoard>
  );
};

export default ServerTime;
