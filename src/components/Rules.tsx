import { Accordion, AccordionDetails, AccordionSummary, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

export const Rules = () => {
  const classes = (makeStyles(() => ({
    list: {
      textAlign: 'left'
    }
  })))()
  return (
    <>
     <Accordion>
       <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
       >
        研究室振り分け用成績算出方法
       </AccordionSummary>
       <AccordionDetails>
         <ul>
           <li className={classes.list}>理学部化学科開講科目のみを算出対象とします。</li>
           <li className={classes.list}>「2Aセメスターと3Sセメスター合計の平均値」または「3Sセメスターのみの平均値」のうち、高い方を採用します。</li>
           <li className={classes.list}>ただし、それぞれ規定の単位数に達していた場合、別表に定められた通りの単位数まで除外ができます。表はSlackにあります。</li>
         </ul>
       </AccordionDetails>
     </Accordion>
    </>
  );
};