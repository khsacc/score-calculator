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
           <li className={classes.list}>基本的には、秋ごろにSlackでお知らせした通り、昨年の踏襲です。差分は「研究室における長期インターン」は考慮しないとした点です。</li>
           <li className={classes.list}>理学部化学科開講科目のみを算出対象とします。</li>
           <li className={classes.list}>「2Aセメスターと3Sセメスター合計の平均値」または「3Sセメスターのみの平均値」のうち、高い方を採用します。</li>
           <li className={classes.list}>ただし、それぞれ規定の単位数に達していた場合、指定の単位数まで除外ができます。</li>
           <ul>
            <li className={classes.list}>3Sの平均について：総取得数12以上17未満→1単位、17以上→2単位</li>
            <li className={classes.list}>2A+3Sの平均について：総取得数15以上25未満→2単位、25以上30未満→3単位、30以上→4単位</li>
          </ul>
        <li className={classes.list}>研究室見学に行った研究室については、当該研究室への配属を希望する場合において、算出した平均値に0.1を加算します。</li>
         </ul>
         
       </AccordionDetails>
     </Accordion>
    </>
  );
};