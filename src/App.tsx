import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button, Card, CardContent } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { courses2A, courses3S } from './courses'

type grade = 'A+'| 'A'| 'B'| 'C'| 'Fail'| 'Absent';
const grades: grade[] = ['A+', 'A', 'B', 'C', 'Fail', 'Absent']

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
      margin: theme.spacing(1),
    },
    result: {
      textAlign: 'center',
      margin: 15
    },
    higher: {
      color: theme.palette.secondary.main
    }
  }
})

const App = () => {
  const classes = useStyles()

  type semesters = '2A' | '3S'
  type scoreData = {name : string; score: number; credit: number; semester: semesters;}
  const [courses, setCourses]: [scoreData[], React.Dispatch<React.SetStateAction<scoreData[]>>] = useState([] as scoreData[]);
  const getScore = (grade: grade) => {
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

  // 選択時に走る函数
  const manageCourse = (name: string, credit: number, semester: semesters, grade: grade) => {
    const targetCourse = courses.find(c => c.name === name);
    const newElement: scoreData = {name, semester, credit, score: getScore(grade)};

    if (typeof targetCourse === 'undefined') {
      // 初めて選択された場合
      setCourses([...courses, newElement]);
    } else {
      // 選択肢の変更
      setCourses([...courses.filter(c => c.name !== name), newElement]);
    }
  }

  // 点数の計算
  // for both semester
  const [averageBoth, setAverageBoth] = useState(0);
  // for only 3S semester
  const [average3S, setAverage3S] = useState(0)

  // coursesを監視して点数を計算する
  useEffect(() => {
    // 点数合計 / 単位数合計
    if (courses.length > 0) {
      setAverageBoth(courses.reduce((pre, cur) => (pre + (cur.score * cur.credit)), 0) / courses.reduce((pre, cur) => (pre + cur.credit), 0))
      setAverage3S(courses.filter(c => c.semester === '3S').reduce((pre, cur) => (pre + (cur.score * cur.credit)), 0) / courses.filter(c => c.semester === '3S').reduce((pre, cur) => (pre + (cur.credit)), 0))  
    }
  }, [courses])

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
                grades.map(grade => <FormControlLabel key={grade} value={grade} onInput={() => manageCourse(course.name, course.credit, '2A', grade)} control={<Radio color="default" />} label={grade} />)
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
                grades.map(grade => <FormControlLabel key={grade} value={grade} onInput={() => manageCourse(course.name, course.credit, '3S', grade)} control={<Radio color="default" />} label={grade} />)
              }
            </RadioGroup>
          </div>
        ))}
      </FormControl>
      <Card className={classes.result}>
        <CardContent>
          <h3>2A + 3S</h3>
            <p>{averageBoth} {averageBoth > average3S && <span className={classes.higher}>[higher!]</span>}</p>
          <h3>3S only</h3>
            <p>{average3S} {averageBoth < average3S && <span className={classes.higher}>[higher!]</span>}</p>
        </CardContent>
      </Card>
      <div>
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
      </div>
    </div>
    
  );
}
export default App;
