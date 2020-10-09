import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormGroup, FormHelperText, Input, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button, Card, CardContent } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
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

const App = () => {
  const classes = useStyles()

  type semesters = '2A' | '3S'
  type scoreData = {name : string; score: number; credit: number; semester: semesters;}
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

  // 成績が入力された科目の情報を保存するstate
  const [courses, setCourses]: [scoreData[], React.Dispatch<React.SetStateAction<scoreData[]>>] = useState([] as scoreData[]);
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
  
  // exclusion
  const [excludeBoth, setExcludeBoth] = useState([] as scoreData[])
  const [exclusionNumBoth, setExclusionNumBoth] = useState(0);

  // exclusionのチェックボックスの開閉で作動する函数
  const handleExcludeBoth = (course: scoreData, isNew: boolean) => {
    isNew
      ? setExcludeBoth([...excludeBoth, course])
      : setExcludeBoth(excludeBoth.filter(e => e.name !== course.name))
  };

  // courseの追加を監視し、exclusion可能な単位数を計算する
  useEffect(() => {
    const totalCredits = courses.reduce((pre, cur) => (pre + cur.credit), 0);
    setExclusionNumBoth(totalCredits < 15 ? 0 : totalCredits < 25 ? 2 : totalCredits < 30 ? 3 : 4)
  }, [courses]);

  const [exclude3S, setExclude3S] = useState([] as scoreData[])
  const handleExclude3S = (event: React.ChangeEvent<{ value: unknown }>) => {
    // setExclude3S(event.target.value as string[]);
  };

  // checkedのvalueとして使うbooleanを出力する函数。
  const isExcluded = (dataArr: scoreData[], target: scoreData) => dataArr.some(datum => datum.name === target.name)

  // もうこれ以上excludeできないときにfalse, まだできるときにtrueを返す
  const isUnderLimit = (upper: number, dataArr: scoreData[]) => dataArr.reduce((pre, cur) => (pre + cur.credit), 0) < upper

  const [isUnderLimitBoth, setIsUnderLimitBoth] = useState(true)
  useEffect(() => {
    setIsUnderLimitBoth(isUnderLimit(exclusionNumBoth, excludeBoth))
  }, [courses, excludeBoth, exclusionNumBoth])

  // courses, exclusionを監視して点数を計算する
  useEffect(() => {
    // 点数合計 / 単位数合計
    if (courses.length > 0) {
      const coursesExclusionBothConsidered = courses.filter(c => !excludeBoth.some(ex => ex.name === c.name));
      setAverageBoth(coursesExclusionBothConsidered.reduce((pre, cur) => (pre + (cur.score * cur.credit)), 0) / coursesExclusionBothConsidered.reduce((pre, cur) => (pre + cur.credit), 0))
      const coursesExclusion3SConsidered = courses.filter(c => c.semester === '3S' && !exclude3S.some(ex => ex.name === c.name));
      if (coursesExclusion3SConsidered.length > 0) {
        setAverage3S(coursesExclusion3SConsidered.reduce((pre, cur) => (pre + (cur.score * cur.credit)), 0) / coursesExclusion3SConsidered.reduce((pre, cur) => (pre + (cur.credit)), 0))  
      }
    }
  }, [courses, exclude3S, excludeBoth])

  // excludeできない状態になっていないかを確認する
  // 念のための処理。実際は選択部分がラジオボタンなのでconsoleで強制的にいじるなどしない限り発動しないはず
  useEffect(() => {
    if (exclusionNumBoth === 0) {
      excludeBoth.length = 0; // reset the array
    }
  }, [excludeBoth.length, exclusionNumBoth])


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
     <>
      <Button
            variant="contained"
            color="secondary"
            size="large"
            className={classes.button}
            onClick={() => {window.location.reload()}}
          >
            RESET
        </Button>
     </>
      <Card className={classes.result}>
        <CardContent>
          <h3>2A + 3S</h3>
            <p>score: {averageBoth} {averageBoth > average3S && <span className={classes.higher}>[higher!]</span>}</p>
            {
              excludeBoth.length > 0 && <p>(excluded: {excludeBoth.map(ex => ex.name).join(',')})</p>
            }
            {
              exclusionNumBoth > 0 && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Select Exclusion... (up to {exclusionNumBoth} credits)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <FormControl component="fieldset">
                  <FormLabel component="legend">除外可能な科目を成績順に表示しています。You can exclude the raw scores up to {exclusionNumBoth} credits</FormLabel>
                    <FormGroup>
                      {
                        courses.filter(co => co.credit <= exclusionNumBoth).sort((a,b) => a.score - b.score).map(c => (
                          <FormControlLabel
                            control={<Checkbox checked={isExcluded(excludeBoth, c)} onChange={(e) => {
                              handleExcludeBoth(c, e.target.checked)
                            }} name={c.name} />}
                            label={`${c.name} (credit: ${c.credit}, your score: ${c.score})`}
                            disabled={!isExcluded(excludeBoth, c) && !isUnderLimitBoth}
                          />
                        ))
                      }
                    </FormGroup>
                    <FormHelperText>You can display an error</FormHelperText>
                  </FormControl>
                  </AccordionDetails>
                </Accordion>
              )
            }
        </CardContent>
      </Card>
      <Card className={classes.result}>
        <CardContent>
          <h3>3S only</h3>
            <p>score: {average3S} {averageBoth < average3S && <span className={classes.higher}>[higher!]</span>}</p>
        </CardContent>
      </Card>
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
