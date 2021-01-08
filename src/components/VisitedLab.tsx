import { Checkbox, FormControl, FormControlLabel } from '@material-ui/core'
import React from 'react'

export const VisitedLab = (props: {
  changeVisited: (name: string) => void
}) => {
  const labList = [
    'Goda',
    'Ohkoshi',
    'Yamanouchi',
    'Tsukuda',
    'Suga',
    'Kobayashi',
    'Oguri',
    'Isobe',
    'Campbell',
    'Hasegawa',
    'Ozawa',
    'Yamada',
    'Shionoya',
    'Kagi',
    'Hirata',
    'Nakamura'
  ];

  return (<div>
    <p>研究室見学に行った研究室を全て選択してください</p>
    <FormControl component="fieldset">
      {labList.map((lab, i) => <FormControlLabel key={i} control={<Checkbox />} label={`${lab} Lab.`} onChange={() => {props.changeVisited(lab)}} labelPlacement="end" />)}
    </FormControl>
  </div>)
}