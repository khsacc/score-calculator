import React from 'react';
import { makeStyles } from '@material-ui/core';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { courses2A, courses3S } from './courses'

const grades = ['A+', 'A', 'B', 'C', 'Fail', 'Absent']

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      background: '#ffefe8',
      minHeight: '100vh',
      padding: 10
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
  }
})

const App = () => {
  const classes = useStyles()
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
                grades.map(grade => <FormControlLabel key={grade} value={grade} control={<Radio color="default" />} label={grade} />)
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
                grades.map(grade => <FormControlLabel key={grade} value={grade} control={<Radio color="default" />} label={grade} />)
              }
            </RadioGroup>
          </div>
        ))}
      </FormControl>
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
