import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, makeStyles, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { semesters, AverageScore, TotalValues } from '../App'

const useStyles = makeStyles((theme) => ({
  result: {
    textAlign: 'center',
    margin: 15
  },
  higher: {
    color: theme.palette.secondary.main
  },
}))

export const ScoreDisplay = (props: {target: semesters[], averageScore: AverageScore, totalValues: TotalValues}) => {
  const classes = useStyles()

  // targetの長さでどちらを表示しているかを判定する
  const [targetScore, anotherScore] = props.target.length === 1 
    ? [props.averageScore["3S"], props.averageScore.both]
    : [props.averageScore.both, props.averageScore["3S"]]

  return (
    <>
    <Card className={classes.result}>
        <CardContent>
          <h3>
            {
              props.target.join(' + ')
            }
          </h3>
            <p>
              score: {targetScore}
              {
                targetScore > anotherScore && <span className={classes.higher}> [ higher ]</span>
              }
            </p>
            {
              // exclude3S.length > 0 && <p>(excluded: {exclude3S.map(ex => ex.name).join(',')})</p>
            }
            {
              // exclusionNum3S > 0 && (
              //   <Accordion>
              //     <AccordionSummary
              //       expandIcon={<ExpandMoreIcon />}
              //       aria-controls="panel1a-content"
              //       id="panel1a-header"
              //     >
              //       <Typography>Select Exclusion... (up to {exclusionNum3S} credits)</Typography>
              //     </AccordionSummary>
              //     <AccordionDetails>
              //     <FormControl component="fieldset">
              //     <FormLabel component="legend">除外可能な科目を成績順に表示しています。You can exclude the raw scores up to {exclusionNum3S} credits</FormLabel>
              //       <FormGroup>
              //         {
              //           courses.filter(co => co.semester === '3S' && co.credit <= exclusionNum3S).sort((a,b) => a.score - b.score).map(c => (
              //             <FormControlLabel
              //               control={<Checkbox checked={isExcluded(exclude3S, c)} onChange={(e) => {
              //                 handleExclude3S(c, e.target.checked)
              //               }} name={c.name} />}
              //               label={`${c.name} (credit: ${c.credit}, your score: ${c.score})`}
              //               disabled={!isExcluded(exclude3S, c) && !isUnderLimit3S && !(exclusionNum3S - c.credit >= 0)}
              //             />
              //           ))
              //         }
              //       </FormGroup>
              //       {/* <FormHelperText>You can display an error</FormHelperText> */}
              //     </FormControl>
              //     </AccordionDetails>
              //   </Accordion>
              // )
            }
        </CardContent>
      </Card>
    </>
  )
}