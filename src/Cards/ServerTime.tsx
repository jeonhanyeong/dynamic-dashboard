import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import ActionTools from './ActionTools';

const CardBoard = styled.div`
  border: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  box-sizing: border-box;
  padding: 10px;
  background-color: ${(props) => props.theme.cardBackColor};
  position: absolute;
  border-radius: 2px;

  transition: height 125ms linear 125ms, width 125ms linear 0s, top 175ms ease-out, left 175ms ease-out,
    right 175ms ease-out;
  z-index: 991;
  min-height: 84px;
  min-width: 84px;
`;

interface TimeZoneValueInfo {
  cardName: string;
  zone: string;
}
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
  handleTileSettingVisible: (cardName: string) => void;
  timeZoneValue: TimeZoneValueInfo;
}

interface TimeInfo {
  date: string;
  time: string;
}

interface TimeZoneInfo {
  continent: string;
  city: string;
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
  handleTileSettingVisible,
  timeZoneValue,
}: CardPosition) => {
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(991);
  const [timeZoneName, setTimeZoneName] = useState<TimeZoneInfo>();
  const [prevTimeZone, setPrevTimeZone] = useState('');

  const [timer, setTimer] = useState<TimeInfo>({
    date: '',
    time: '',
  });
  const [fontRatio, setFontRatio] = useState(0);

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };

  const currentTimer = () => {
    const selectTimeZone = (timeZoneValue.zone as string)
      ? moment()
          .tz(timeZoneValue.zone as string)
          .format('YYYY-MM-DD HH:mm:ss')
      : '';
    const dateTime = moment(selectTimeZone);
    const selDate = dateTime.format('YYYY년 MM월 DD일');
    const selTime = dateTime.format('HH:mm:ss');
    setTimer((prev) => ({
      ...prev,
      date: selDate,
      time: selTime,
    }));
  };

  console.log('커렌트타이머')
  useEffect(() => {
    setFontRatio(Math.floor(widthPx / 6));
  }, [widthPx]);

  // timeZoneValue.cardName 이랑 현재 카드랑 비교해서 맞는지 검사 후에 ....이거 해결해야 카드 전체가 안바뀜
  
  useEffect(() => {
    const timeZone = timeZoneValue.zone as string;
    const parts = timeZone.split('/'); // '/'를 기준으로 문자열을 나눔
    const formattedTimeZone = parts.map((part) => part.replace('_', ' ')); // '_'를 공백으로 대체
    setTimeZoneName((prev) => ({
      ...prev,
      continent: formattedTimeZone[0],
      city: formattedTimeZone[1],
    }));
    const serverTime = setInterval(currentTimer, 1000);
   return () => {

     clearInterval(serverTime);
   };
  }, [timeZoneValue]);

  // console.log('리렌더링')

// useEffect(()=>{
//  setInterval(currentTimer, 1000);
// },[])

// useEffect(()=>{
//   const serverTime = setInterval(currentTimer, 1000);
//   console.log('실행')
//   return () => {
//     console.log('지움')
//     clearInterval(serverTime);
//   };
// },[])



//   const ttt = setInterval(currentTimer, 1000);
// clearInterval(ttt)

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
          handleTileSettingVisible={handleTileSettingVisible}
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
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000', fontSize: fontRatio / 3.5 }}>
          {' '}
          {timeZoneName?.continent}{' '}
        </span>
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000', fontSize: fontRatio / 3 }}>
          {' '}
          <strong>{timeZoneName?.city} </strong>
        </span>
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000', fontSize: fontRatio, marginBottom: '10px' }}>
          <strong>{`${timer.time}`}</strong>
        </span>
        <span style={{ color: isDarkMode ? 'lightgray' : 'gray', fontSize: fontRatio / 3.5 }}>{`${timer.date}`}</span>
      </div>
    </CardBoard>
  );
};

export default ServerTime;
