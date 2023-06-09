import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface MyComponentProps {
  isDarkMode: boolean;
  handleTileSettingVisible: (cardName: string) => void;
  handleTimeZone: (value: string) => void;
  selectServerTimeCard: string;
}

const TileGalleryContents = styled.div`
  /* 스타일 작성 */
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 10px;
  width: 20%;
  height: 100%;
  position: absolute;
  right: 0;
  border-left: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  padding: 0;
  z-index: 998;
`;

const TileGalleryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 0 10px;
`;

const TileGalleryBody = styled.div`
  margin: 0;
  padding: 0;
  width: 90%;
  height: 70%;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  overflow-y: auto;
`;

const Close = styled(CloseIcon)(({ theme }) => ({
  cursor: 'pointer',
  backgroundColor: theme.bgColor,
  color: theme.textColor,
  '&:hover': {
    backgroundColor: '#a52121',
    color: '#EDECEB',
    transition: 'background-color 0.1s ease-in-out',
    cursor: 'pointer',
  },
  padding: '5px',
}));

const buttonStyle = {
  margin: '20px',
};

interface TimeZoneInfo {
  countryName: string;
  value: string;
}
const TileSetting = ({
  isDarkMode,
  handleTileSettingVisible,
  handleTimeZone,
  selectServerTimeCard,
}: MyComponentProps) => {
  const [selectTimeZone, setSelectTimeZone] = useState('Asia/Seoul');
  const [timeZone, setTimeZone] = useState<TimeZoneInfo[]>([
    {
      countryName: '아메리카_로스앤젤레스',
      value: 'America/Los_Angeles',
    },
    {
      countryName: '아메리카_뉴욕',
      value: 'America/New_York',
    },
    {
      countryName: '유럽_런던',
      value: 'Europe/London',
    },
    {
      countryName: '유럽_로마',
      value: 'Europe/Rome',
    },
    {
      countryName: '아시아_도쿄',
      value: 'Asia/Tokyo',
    },
    {
      countryName: '아시아_서울',
      value: 'Asia/Seoul',
    },
  ]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectTimeZone(event.target.value);
    handleTimeZone(event.target.value);
  };
  // 창 닫는 이벤트
  const handleGalleryClose = () => {
    handleTileSettingVisible('');
  };

  return (
    <TileGalleryContents>
      <TileGalleryHeader>
        <h1>타일 설정</h1>
        <Close onClick={handleGalleryClose} />
      </TileGalleryHeader>
      <p style={{ fontSize: '14px', padding: '0 15px' }}>시간대 변경</p>
      <TileGalleryBody>
        <div style={{ paddingLeft: '15px', display: 'flex', width: '80%', marginTop: '5px' }}>
          <Select
            labelId="timezone-select-label"
            id="timezone-simple-select"
            value={selectTimeZone}
            onChange={handleChange}
            sx={{
              width: '100%',
              minHeight: '20px',
              maxHeight: '30px',
              color: isDarkMode ? '#EDECEB' : '#000',
              borderBlockColor: isDarkMode ? '#EDECEB' : '#000',
            }}
          >
            {timeZone.map((time, index) => (
              <MenuItem value={time.value} key={time.countryName}>
                {time.countryName}
              </MenuItem>
            ))}
          </Select>
        </div>
      </TileGalleryBody>
    </TileGalleryContents>
  );
};

export default TileSetting;
