import React from 'react'
import { Card, CardContent, makeStyles } from '@material-ui/core'
import { semesters, AverageScore, TotalValues, CoursesData, RawAverageScore } from '../App'
import { ExlcludeCourse } from './ExcludeCourse'

const useStyles = makeStyles((theme) => ({
  result: {
    textAlign: 'center',
    margin: 15
  },
  higher: {
    color: theme.palette.secondary.main
  },
}))

export const ScoreDisplay = (props: {
  target: semesters[],
  averageScore: AverageScore,
  rawAverageScore: {both: RawAverageScore, '3S': RawAverageScore},
  totalValues: TotalValues,
  coursesData: CoursesData[],
  toggleExclusionEachCourse: (name: string, kind: 'both' | '3S') => void
}) => {
  const classes = useStyles()

  // targetの長さでどちらを表示しているかを判定する
  const [targetScore, anotherScore] = props.target.length === 1 
    ? [props.averageScore["3S"], props.averageScore.both]
    : [props.averageScore.both, props.averageScore["3S"]]
  const targetRawScore = props.target.length === 1 
    ? props.rawAverageScore["3S"]
    : props.rawAverageScore.both

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
              score: {targetRawScore.score} / {targetRawScore.credit} = {targetScore}
              {
                targetScore > anotherScore && <span className={classes.higher}> [ higher ]</span>
              }
            </p>
            <ExlcludeCourse
              target={props.target}
              totalValues={props.totalValues}
              toggleExclusionEachCourse={props.toggleExclusionEachCourse}
              coursesData={props.coursesData}
              isBoth={props.target.length === 2}
            />
        </CardContent>
      </Card>
    </>
  )
}