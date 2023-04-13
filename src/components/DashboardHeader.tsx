import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import TileGallery from './TileGallery';

const ContentTop = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: 100%;
  height: 50px;
  padding: 0 25px 0 40px;
  margin-top: 20px;
  box-sizing: border-box;
`;
const Explain = styled.div`
  width: 100%;
  height: 70px;
  padding: 0 25px 0 40px;
  box-sizing: border-box;
  display: block;
`;

const DashboardHeader = () => {
  const galleryOpen = () => {
    console.log('타일 추가!');
  };

  return (
    <>
      <ContentTop>
        <TextField
          value="제목 없음"
          variant="outlined"
          size="small"
          InputProps={{
            style: {
              height: '30px',
              fontSize: '15px',
              marginRight: '10px',
            },
          }}
        />
        <Button variant="contained" color="primary" size="small">
          저장
        </Button>
        <Button variant="outlined" size="small">
          미리보기
        </Button>
        <Button variant="outlined" size="small">
          취소
        </Button>
      </ContentTop>
      <Explain>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} size="small" onClick={galleryOpen}>
          타일 추가
        </Button>
        <div style={{ marginTop: '5px' }}>
          타일을 크기 조정하거나 이동 또는 편집하거나 대시보드에 추가할 수 있습니다.
        </div>
      </Explain>
    </>
  );
};

export default DashboardHeader;
