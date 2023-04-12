import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import testImage from '../assets/images/test.png';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      fontSize: '13px',
      margin: 0,
      padding: '10px 20px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#dcdcdc',
      },
    },
    card: {
      display: 'flex',
      minHeight: '50px',
      width: '100%',
      boxSizing: 'border-box',
    },
    cover: {
      flex: '0 0 80px',
      height: '80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #ccc',
    },
    content: {
      marginLeft: '15px',
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 auto',
      minWidth: 0,
    },
    title: {
      fontSize: '14px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    description: {
      marginTop: '8px',
      fontSize: '12px',
      display: 'block',
      lineHeight: '16px',
      maxHeight: '48px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

const TileCard = () => {
  const classes = useStyles();

  return (
    <li className={classes.root}>
      <div className={classes.card}>
        <CardMedia className={classes.cover} image={testImage} title="Title" />
        <div className={classes.content}>
          <span className={classes.title}>매트릭 차트</span>
          <span className={classes.description}>
            Azure Monitor의 메트릭은 근 근 실시간 시나리오를 지원하는 경량 메트릭으로, 문제를 알리고 빠르게 감지하는 데
            특히 유용합니다. 줄바꿈줄바꿈
          </span>
        </div>
      </div>
    </li>
  );
};

export default TileCard;
