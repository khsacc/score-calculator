import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { course, courses2A, courses3S } from './courses'
import { ScoreDisplay } from './components/ScoreDisplay'

export type grade = 'A+'| 'A'| 'B'| 'C'| 'Fail'| 'Absent';
const grades: grade[] = ['A+', 'A', 'B', 'C', 'Fail', 'Absent']
export type semesters = '2A' | '3S'
export type CoursesData = course & {grade: grade | undefined; excludedBoth: boolean; excluded3S: boolean }
export type AverageScore = { both: number; '3S': number }

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
      padding: '0 10px 10px 0'
    },
    eachInputWrap: {
      margin: '15px 0'
    },
    button: {
      margin: '10px auto',
      display: 'block',
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

  // 平均値の計算
  const [totalValues, setTotalValues] = useState({
    '2A': {score: 0, credit: 0},
    '3S': {score: 0, credit: 0}
  } as TotalValues)

  const [averageScore, setAverageScore] = useState({ both: 0, '3S' : 0 } as AverageScore)


  useEffect(() => {
    // 計算函数の定義
    const getTotalValues = (target: semesters[]) => {
      // 単位数合計と点数合計を計算する
      return coursesData.reduce((pre: {score: number, credit: number}, cur) => (
        // 当該セメスターの科目であり、かつ、ラジオボタンに何かしらの成績が入力されているものが計算対象
        target.includes(cur.semester) && typeof cur.grade !== 'undefined'
          ? {
            score: pre.score + (getScore(cur.grade) * cur.credit),
            credit: pre.credit + cur.credit,
          }
          : pre
        ), {score: 0, credit: 0})
    }
    
    // 取得単位数、合計得点を計算して格納する
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
  }, [coursesData])

  useEffect(() => {
    // 平均値の計算
    const calcAvg = (arr: CoursesData[]) => {
      const values = arr.reduce((pre, cur) => {
        return {
          credit: pre.credit + cur.credit,
          score: pre.score + (getScore(cur.grade as grade) * cur.credit)
        }
      }, {credit: 0, score: 0})
      
      return values.score / values.credit || 0
    }
    setAverageScore({
      both: calcAvg(coursesData.filter(c => typeof c.grade !== 'undefined' && !c.excludedBoth)), // 成績入力済みかつ除外対象外
      // ((totalValues["2A"].score + totalValues["3S"].score) / (totalValues["2A"].credit + totalValues["3S"].credit)) || 0,
      '3S': calcAvg(coursesData.filter(c => typeof c.grade !== 'undefined' && c.semester === '3S' && !c.excludedBoth))
    })  
    
  }, [coursesData, totalValues])

  return (
    <div className={classes.wrapper}>
      <h1>Score Calculator</h1>
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

      <Button
            variant="contained"
            color="secondary"
            size="large"
            className={classes.button}
            onClick={() => {window.location.reload()}}
          >
            RESET
        </Button>
     
     <ScoreDisplay 
        target={['2A', '3S']}
        averageScore={averageScore}
        totalValues={totalValues}
        toggleExclusionEachCourse={toggleExclusionEachCourse}
        coursesData={coursesData}
      />
     <ScoreDisplay 
      target={['3S']} 
      averageScore={averageScore} 
      totalValues={totalValues}
      toggleExclusionEachCourse={toggleExclusionEachCourse} 
      coursesData={coursesData}
     />
     
      {/* <div>
        <TextField required label="Student ID" variant="outlined" className={classes.textInput} />
        <TextField required label="Your Name (full)" variant="outlined" className={classes.textInput} />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<SaveIcon />}
        >
          Export PDF
        </Button>
      </div> */}
    </div>
    
  );
}

export default App;
