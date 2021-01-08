import React, { useEffect, useState } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { course, courses2A, courses3S } from './courses'
import { ScoreDisplay } from './components/ScoreDisplay'
import { Rules } from './components/Rules'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDF } from './components/Pdf'
import { VisitedLab } from './components/VisitedLab'

export type grade = 'A+'| 'A'| 'B'| 'C'| 'Fail'| 'Absent';
const grades: grade[] = ['A+', 'A', 'B', 'C', 'Fail', 'Absent']
export type semesters = '2A' | '3S'
export type CoursesData = course & {grade: grade | undefined; excludedBoth: boolean; excluded3S: boolean }
export type AverageScore = { both: number; '3S': number }
export type RawAverageScore = {credit: number, score: number, avg: number}

type TotalValue = {score: number, credit: number}
export type TotalValues = {'2A' : TotalValue, '3S': TotalValue}

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      background: '#ffefe8',
      minHeight: '100vh',
      padding: 10,
      textAlign: 'center'
    },
    textInput: {
      padding: '0px 10px 10px 0',
      margin: 10,
    },
    eachInputWrap: {
      margin: '15px 0'
    },
    button: {
      margin: '10px',
      // display: 'block',
    },
    result: {
      textAlign: 'center',
      margin: 15
    },
    higher: {
      color: theme.palette.secondary.main
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  }
})

export type scoreData = {name : string; score: number; credit: number; semester: semesters;}

// 成績に対して対応する点数をnumberで返す
export const getScore = (grade: grade): number => {
  switch (grade) {
    case 'A+':
      return 4.3;
    case 'A':
      return 4;
    case 'B':
      return 3;
    case 'C':
      return 2;
    default:
      return 0
  }
}

const App = () => {
  const classes = useStyles()

  const coursesDataInit: CoursesData[] = [...courses2A, ...courses3S].map(c => ({ ...c, grade: undefined, excludedBoth: false, excluded3S: false}))
  // 全ての成績に関する情報をこのstateに格納する
  const [coursesData, setCoursesData] = useState(coursesDataInit)

  // ラジオボタンの選択時に走る函数
  const manageEachCourse = (name: string, grade: grade) => {
    setCoursesData(coursesData.map(c => (
      c.name === name
        ? 
          {
            name: c.name,
            credit: c.credit,
            semester: c.semester,
            grade: grade,
            excludedBoth: c.excludedBoth,
            excluded3S: c.excluded3S
          }
        : c      
    )))
  }

  // 除外函数
  const toggleExclusionEachCourse = (name: string, kind: 'both' | '3S') => {
    console.log(`${name} excluded from ${kind}`)
    setCoursesData(coursesData.map(c => (
      c.name === name
        ? 
          {
            name: c.name,
            credit: c.credit,
            semester: c.semester,
            grade: c.grade,
            excludedBoth: kind === 'both' ? !c.excludedBoth : c.excludedBoth,
            excluded3S: kind === '3S' ? !c.excluded3S : c.excluded3S,
          }
        : c      
    )))
  }

  // 総単位数、総取得点数を計算する。ここでは除外は考慮されていないことに注意する。
  const [totalValues, setTotalValues] = useState({
    '2A': {score: 0, credit: 0},
    '3S': {score: 0, credit: 0}
  } as TotalValues)

  const [averageScore, setAverageScore] = useState({ both: 0, '3S' : 0 } as AverageScore)
  const [rawAverageScore, setRawAverageScore] = useState({ both: {credit: 0, score: 0, avg: 0}, '3S': {credit: 0, score: 0, avg: 0}})

  useEffect(() => {
    // 計算函数の定義
    const getTotalValues = (target: semesters[]) => {
      // 単位数合計と点数合計を計算する
      return coursesData.reduce((pre: {score: number, credit: number}, cur) => (
        // 当該セメスターの科目であり、かつ、ラジオボタンに何かしらの成績が入力されており（未履修でない）、かつその成績が合格であるもの対象
        target.includes(cur.semester) && typeof cur.grade !== 'undefined' && getScore(cur.grade) > 0
          ? {
            score: pre.score + (getScore(cur.grade) * cur.credit),
            credit: pre.credit + cur.credit,
          }
          : pre
        ), {score: 0, credit: 0})
    }
    
    // 取得単位数、合計得点を計算して格納する
    
    const calcAvg = (arr: CoursesData[]): RawAverageScore => {
      const values = arr.reduce((pre, cur) => {
        return {
          credit: pre.credit + cur.credit,
          score: pre.score + (getScore(cur.grade as grade) * cur.credit)
        }
      }, {credit: 0, score: 0})
      
      return {credit: Math.round(values.credit*100)/100, score: Math.round(values.score*100)/100, avg: Math.round((values.score / values.credit) * 100) / 100 || 0}
    }

    const [totalValues2A, totalValues3S] = [getTotalValues(['2A']), getTotalValues(['3S'])]
    setTotalValues({
      '2A': {
        score: totalValues2A.score,
        credit: totalValues2A.credit,
      },
      '3S': {
        score: totalValues3S.score,
        credit: totalValues3S.credit,
      }
    })
    // 平均値の計算
    // 成績入力済みかつ除外対象外
    const calBoth = calcAvg(coursesData.filter(c => typeof c.grade !== 'undefined' && !c.excludedBoth))
    const cal3S = calcAvg(coursesData.filter(c => typeof c.grade !== 'undefined' && c.semester === '3S' && !c.excluded3S))
    setRawAverageScore({both: calBoth, '3S': cal3S})
    setAverageScore({
      both: calBoth.avg, 
      '3S': cal3S.avg
    })  
  }, [coursesData])

  const [visitedLab, setVisitedLab] = useState([] as string[])
  const changeVisited = (name: string) => {
    const target = visitedLab.find(l => l === name)
    if (typeof target === 'undefined') {
      // 新規追加
      setVisitedLab([...visitedLab, name])
    } else {
      // 削除
      setVisitedLab(visitedLab.filter(e => e !== name))
    }
  }

  const [nameData, setNameData] = useState("")
  const [numberData, setNumberData] = useState("")

  const [PDFData, setPDFData] = useState(<PDF visitedLab={visitedLab} name="" coursesData={coursesData} AverageScore={averageScore} />)
  const [generated, setGenerated] = useState(false)

  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    setGenerated(false);
    setIsReady(nameData !== '' && numberData !== '' && coursesData.filter(c => c.required === true).every(c => typeof c.grade !== 'undefined'))
  }, [coursesData, nameData, numberData])

  const generatePDF = () => {
    setPDFData(<PDF visitedLab={visitedLab} name={`${numberData}_${nameData}`} coursesData={coursesData} AverageScore={averageScore} />);
    setGenerated(true)
  }

  return (
    <div className={classes.wrapper}>
      <h1>Score Calculator</h1>
      <Rules />
      <p style={{fontWeight: 'bold'}}>履修していない科目については、どのラジオボタンも選択せず空欄にしてください</p>
      <h2>2A semester</h2>
      <FormControl component="fieldset">
        {courses2A.map((course, idx) => (
          <div key={idx} className={classes.eachInputWrap}>
            <FormLabel component="legend">{course.name}</FormLabel>
            <RadioGroup aria-label={course.name} name={course.name} row>
              {
                grades.map(grade => <FormControlLabel key={grade} value={grade} onInput={() => manageEachCourse(course.name, grade)} control={<Radio color="default" />} label={grade} />)
              }
            </RadioGroup>
          </div>
        ))}
      </FormControl>
      <h2>3S semester</h2>
      <FormControl component="fieldset">
        {courses3S.map((course, idx) => (
          <div key={idx} className={classes.eachInputWrap}>
            <FormLabel component="legend">{course.name}</FormLabel>
            <RadioGroup aria-label={course.name} name={course.name} row aria-required>
              {
                grades.map(grade => <FormControlLabel key={grade} value={grade} onInput={() => manageEachCourse(course.name, grade)} control={<Radio color="default" />} label={grade} />)
              }
            </RadioGroup>
          </div>
        ))}
      </FormControl>

      <div>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          className={classes.button}
          onClick={() => {window.location.reload()}}
        >
          RESET
        </Button>
      </div>
      

      <p>
        計算された平均値が以下に表示されます。念のため自分でも確認してください。
        <br />
        除外できる単位数に達していると、除外可能な科目が成績順に表示されます。適宜選択してください。
      </p>
     
     <ScoreDisplay 
        target={['2A', '3S']}
        averageScore={averageScore}
        rawAverageScore={rawAverageScore}
        totalValues={totalValues}
        toggleExclusionEachCourse={toggleExclusionEachCourse}
        coursesData={coursesData}
      />
     <ScoreDisplay 
      target={['3S']} 
      averageScore={averageScore} 
      rawAverageScore={rawAverageScore}
      totalValues={totalValues}
      toggleExclusionEachCourse={toggleExclusionEachCourse} 
      coursesData={coursesData}
     />
     <div>
       <VisitedLab changeVisited={changeVisited} />
     </div>
     <div>
       学生番号は「0520****」の形式のものをハイフンを入れずに半角数字で入力してください。<br />
       氏名はアルファベットで入力してください（読みが面倒なので……）。日本語入力すると正しく出力されない設定にしてあります。<br />
        <TextField required label="Student ID" variant="outlined" aria-required className={classes.textInput} onChange={e => setNumberData(e.target.value)} />
        <TextField required label="Your Name (full)" variant="outlined" aria-required className={classes.textInput} onChange={e => setNameData(e.target.value)} />
      </div>
      {/* <div style={{margin: 20}}>
        成績証明書の写真を下のボタンからアップロードしてください。<br />
        <input type="file" alt="成績証明書の写真" />
      </div> */}
      {!generated && <p>データを全て入力し、「Generate PDF」ボタンを押してください。<br />PDF生成が終了すると、保存ボタンが表示されるので、クリックして保存してください。</p>}
      <>
        {coursesData.filter(c => c.required === true).some(c => typeof c.grade === 'undefined') && <li>必修科目の成績を入力してください。</li>}
        {nameData === '' && <li>氏名をアルファベット表記で入力してください。</li>}
        {numberData === '' && <li>学籍番号を入力してください。</li>}
        {visitedLab.length === 0 && <li>訪問した研究室の選択がありませんが、問題ありませんか？</li>}
      </>
      <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          onClick={() => {
            generatePDF()
          }}
          // disabled={!isReady}
          // disabled={true}
        >
          {generated ? 'Re-generate PDF' : 'Generate PDF'}
      </Button>
      <br />
      {/* <p>算出ルールの最終確認中のため、まだPDF作成はできません。8日金曜日ごろ解禁する予定です。</p> */}
      {
        generated && (
          <PDFDownloadLink fileName={`${numberData}_${nameData}`} document={PDFData} style={{textDecoration: 'none', width: 'fit-content'}}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={classes.button}
              startIcon={<SaveIcon style={{margin: 0}} />}
            >
              Save PDF
            </Button>
          </PDFDownloadLink>
        )
      }
    </div>
    
  );
}

export default App;
