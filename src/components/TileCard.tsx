import { useState } from 'react';
import styled from 'styled-components';
import CardMedia from '@mui/material/CardMedia';

import barChartImage from '../assets/images/barChartIcon.png';
import lineChartImage from '../assets/images/lineChartIcon.png';
import userImage from '../assets/images/usersIcon.png';
import timeImage from '../assets/images/timeIcon.png';
import listImage from '../assets/images/listIcon.png';
import testImage from '../assets/images/test.png';

const Card = styled.div`
  display: flex;
  min-height: 50px;
  width: 100%;
  box-sizing: border-box;
`;

const media = {
  flex: '0 0 70px',
  height: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #ccc',
};

const CardContent = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
`;

const CardTitle = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDescription = styled.span`
  margin-top: 8px;
  font-size: 12px;
  display: block;
  line-height: 16px;
  max-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
interface TileCardProps {
  type: string;
  tileDescription: string;
}
const TileCard = ({ type, tileDescription }: TileCardProps) => {
  const classes = `${type} Tile`;

  const handleDragStart = () => {
    return true;
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // type에 따라 이미지 선택
  let image;
  if (type === 'Active Users' || type === 'Monthly Active User') {
    image = userImage;
  } else if (type === 'MAU by month in the last 5 months') {
    image = barChartImage;
  } else if (type === 'Number of connections by application in the last 20 days') {
    image = lineChartImage;
  } else if (type === 'User List') {
    image = listImage;
  } else if (type === 'Server Time') {
    image = timeImage; // 기본 이미지
  } else {
    image = testImage;
  }

  return (
    <Card draggable className={classes} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}>
      <CardMedia style={media} component="img" image={image} title="Title" sx={{ padding: '5px' }} />
      <CardContent>
        <CardTitle>
          <strong>{type}</strong>
        </CardTitle>
        <CardDescription>
          {tileDescription} 입니다. <br />
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default TileCard;
