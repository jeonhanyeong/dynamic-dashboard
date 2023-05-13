import React, { useState, useRef } from 'react';
import Button from '@mui/material//Button';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';

type MyComponentProps = {
  handleGalleryVisible: () => void;
  handlePreview: () => void;
  handleOpenEditDashboard: () => void;
  handleSaveDashboard: (title: string) => void;
};

const ContentTop = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: 100%;
  height: 50px;
  padding: 0 25px 0 40px;
  margin-top: 20px;
  box-sizing: border-box;
  justify-content: space-between;
`;
const Explain = styled.div`
  width: 100%;
  height: 20px;
  padding: 0 0 0 40px;
  box-sizing: border-box;
  display: block;
`;

const btnStyle = {
  marginRight: '10px',
};

const EditDashboardHeader = ({
  handleGalleryVisible,
  handlePreview,
  handleOpenEditDashboard,
  handleSaveDashboard,
}: MyComponentProps) => {
  const [clickPreview, setClickPreview] = useState(true);
  const [dashboardTitle, setDashboardTitle] = useState('제목 없음');
  const dashboardTitleRef = useRef<HTMLInputElement>(null);

  const galleryOpen = () => {
    handleGalleryVisible();
  };

  const handlePreviewClick = () => {
    setClickPreview((prevClick) => !prevClick);
    handlePreview();
  };

  const handleCancleClick = () => {
    handleOpenEditDashboard();
  };

  const handleSaveClick = () => {
    const title = dashboardTitleRef.current as HTMLInputElement;
    handleSaveDashboard(title.value);
  };

  return (
    <>
      <ContentTop>
        <div style={{ display: 'flex' }}>
          {clickPreview ? (
            <TextField
              inputRef={dashboardTitleRef}
              placeholder="제목 없음"
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
          ) : (
            <div
              style={{
                height: '30px',
                marginRight: '10px',
                width: '220px',
                textOverflow: 'ellipsis',
                fontSize: '20px',
                fontWeight: 'bold',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {dashboardTitle}
            </div>
          )}

          <Button style={btnStyle} variant="contained" color="primary" size="small" onClick={handleSaveClick}>
            저장
          </Button>
          <Button style={btnStyle} variant="outlined" size="small" onClick={handlePreviewClick}>
            {clickPreview ? '미리보기' : '편집'}
          </Button>
          <Button style={btnStyle} variant="outlined" size="small" onClick={handleCancleClick}>
            취소
          </Button>
          {clickPreview && (
            <Button
              style={btnStyle}
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              size="small"
              onClick={galleryOpen}
            >
              갤러리 열기
            </Button>
          )}
        </div>
      </ContentTop>
      <Explain>
        {clickPreview ? (
          <span>타일을 크기 조정하거나 이동 또는 편집하거나 대시보드에 추가할 수 있습니다.</span>
        ) : (
          <span>미리보기 화면입니다.</span>
        )}
      </Explain>
    </>
  );
};

export default EditDashboardHeader;
