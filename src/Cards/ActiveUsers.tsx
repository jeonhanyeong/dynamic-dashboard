import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { encode } from 'base-64';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import ActionTools from './ActionTools';

interface apiInfoInterface {
  gateway: string;
  username: string;
  password: string;
}

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
  apiInfo: apiInfoInterface;
  isDarkMode: boolean;
}

const ActiveUser = ({
  topPx,
  name,
  leftPx,
  widthPx,
  heightPx,
  displayState,
  isPreview,
  handleDelete,
  handleContext,
  apiInfo,
  isDarkMode,
}: CardPosition) => {
  const credentials = encode(`${apiInfo.username}:${apiInfo.password}`);
  const basicAuth = `Basic ${credentials}`;

  const cardBoardRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(991);
  const [fontRatio, setFontRatio] = useState(0);
  const [uniqueUserCount, setUniqueUserCount] = useState(0);
  const [standardDate, setStandardDate] = useState('');

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };

  const getData = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setStandardDate(formattedDate);
    axios
      .get(`${apiInfo.gateway}iam/metric/login/application/log`, {
        headers: {
          Authorization: basicAuth,
        },
        params: {
          date: formattedDate,
        },
      })
      .then((response) => {
        const uniqueUsernames = new Set(response.data.map((item: any) => item.username));
        setUniqueUserCount(uniqueUsernames.size);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setFontRatio(Math.floor(widthPx / 4));
  }, []);

  useEffect(() => {
    getData();
  }, []);

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
          justifyContent: 'space-around',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PersonIcon
          style={{
            fontSize: Math.floor(fontRatio),
            color: 'rgb(21, 101, 192)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', width: widthPx / 2.2 }}>
          <span style={{ color: isDarkMode ? '#EDECEB' : '#000', fontSize: Math.floor(fontRatio / 5) }}>
            <strong>활성 유저</strong>
          </span>
          <span style={{ color: isDarkMode ? '#6F6E6D' : 'gray', fontSize: Math.floor(fontRatio / 5.5) }}>
            Active Users
          </span>
          <span style={{ fontSize: Math.floor(fontRatio / 1.5), marginBottom: '10px' }}>
            <strong>{uniqueUserCount}</strong>
          </span>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '10px' }}>
        <span style={{ color: isDarkMode ? 'lightgray' : 'gray', fontSize: Math.floor(fontRatio / 8) }}>
          당일 기준 ({standardDate})
        </span>
      </div>
    </CardBoard>
  );
};

export default ActiveUser;
