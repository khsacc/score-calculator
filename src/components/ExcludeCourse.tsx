import { Accordion, AccordionSummary, AccordionDetails, FormControl, FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React, { useEffect, useState } from "react";
import { semesters, TotalValues, CoursesData, getScore, grade } from "../App";

export const ExlcludeCourse = (props: {
  target: semesters[],
  totalValues: TotalValues,
  coursesData: CoursesData[],
  toggleExclusionEachCourse: (name: string, kind: 'both' | '3S') => void
  isBoth: boolean
}) => {
  const [exclusionLimit, setExclusionLimit] = useState(0)
  useEffect(() => {
    setExclusionLimit((() => {
      if (!props.isBoth) {
        // 3S only
        const targetCredits = props.totalValues["3S"].credit
        return targetCredits < 12
          ? 0
          : targetCredits < 17
            ? 1
            : 2
      } else if (props.target.length === 2) {
        // both
        const targetCredits = props.totalValues["3S"].credit + props.totalValues["2A"].credit
        return targetCredits < 15 
          ? 0
          : targetCredits < 25
            ? 2
            : targetCredits < 30
              ? 3
              : 4
      } else {
        return 0
      }
    })())
  }, [props.isBoth, props.target, props.totalValues])

  // あと何単位除外できるかの計算
  const [exclusionRemain, setExclusionRemain] = useState(0);
  useEffect(() => {
    // 現在のところ除外されている単位数の計算
    const currentlyExcludedCredits = props.coursesData
      .filter(c => props.target.includes(c.semester) && (props.isBoth ? c.excludedBoth : c.excluded3S))
      .reduce((pre, cur) => (pre + cur.credit), 0)
    setExclusionRemain(exclusionLimit - currentlyExcludedCredits)
  }, [exclusionLimit, props.isBoth, props.coursesData, props.target])

  return (
    <>
      {
        exclusionLimit > 0 && <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            除外する科目を選択してください（{exclusionLimit}単位まで除外できます）
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset">
              <FormGroup>
                {
                  props.coursesData
                    .filter(c => typeof c.grade !== 'undefined' && props.target.includes(c.semester)) // 当該セメスターのみ抽出
                    .sort((a, b) => getScore(a.grade as grade) - getScore(b.grade as grade)) // 点数順にソート
                    .map((c, idx) => !(
                      (props.isBoth ? !c.excludedBoth : !c.excluded3S) &&
                      (c.credit > exclusionRemain || exclusionRemain <= 0)
                    ) && (
                      <FormControlLabel
                        key={idx}
                        control={
                          <Checkbox
                            checked={props.isBoth ? c.excludedBoth :c.excluded3S}
                            onChange={() => {
                              if (
                                !(
                                  (props.isBoth ? !c.excludedBoth : !c.excluded3S) &&
                                  (c.credit > exclusionRemain || exclusionRemain <= 0)
                                )
                              ) {
                                props.toggleExclusionEachCourse(c.name, props.isBoth ? 'both' : '3S')
                              }
                            }}
                            name={c.name}
                          />
                        }
                        label={`${c.name} (credit: ${c.credit}, your grade: ${c.grade})`}
                        disabled={
                          (props.isBoth ? !c.excludedBoth : !c.excluded3S) &&
                          (c.credit > exclusionRemain || exclusionRemain <= 0)
                        }
                      />
                    ))
                }
                {/* {courses
                  .filter(
                    (co) => co.semester === "3S" && co.credit <= exclusionNum3S
                  )
                  .sort((a, b) => a.score - b.score)
                  .map((c) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isExcluded(exclude3S, c)}
                          onChange={(e) => {
                            handleExclude3S(c, e.target.checked);
                          }}
                          name={c.name}
                        />
                      }
                      label={`${c.name} (credit: ${c.credit}, your score: ${c.score})`}
                      disabled={
                        !isExcluded(exclude3S, c) &&
                        !isUnderLimit3S &&
                        !(exclusionNum3S - c.credit >= 0)
                      }
                    />
                  ))} */}
              </FormGroup>
              {/* <FormHelperText>You can display an error</FormHelperText> */}
            </FormControl>
          </AccordionDetails>
        </Accordion>
      }
    </>
  );
};
