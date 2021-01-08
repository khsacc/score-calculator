import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {AverageScore, CoursesData} from '../App'

// Create styles
const styles = StyleSheet.create({
  page: {
    // flexDirection: 'row',
    // backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    // flexGrow: 1
  },
  acceptedScore: {
    border: "1px solid black",
    margin: 20,
    fontSize: 20

  }
});

// Create Document Component
export const PDF = (props: {
  name: string,
  coursesData: CoursesData[],
  AverageScore: AverageScore,
  visitedLab: string[]
}) => {
  const acceptedScore = props.AverageScore.both >= props.AverageScore['3S'] ? props.AverageScore.both : props.AverageScore['3S']
  const now = new Date();
  return (
  <Document title={props.name}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.name}</Text>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>SCORE</Text>
        <Text style={styles.acceptedScore}>{acceptedScore}</Text>
        <Text>(2A+3S: {props.AverageScore.both}, 3S: {props.AverageScore['3S']})</Text>
        <Text>(Visited Lab(s): {props.visitedLab.join(', ')})</Text>
      </View>
      <View style={styles.section}>
        {
          props.coursesData.map((c, i) => (
            <Text key={i} style={{margin: 5}}>
              {c.name}: {typeof c.grade === 'undefined' ? '-' : c.grade}
              {
                (c.excluded3S || c.excludedBoth) ? `  [excluded: ${[c.excludedBoth ? '2A+3S' : '', c.excluded3S ? '3S' : ''].filter(e => e !== '').join(', ')}]` : <></>
              }
              </Text>
          ))
        }
      </View>
      <View style={styles.section}>
        <Text>
          {now.toString()}
        </Text>
      </View>
    </Page>
  </Document>
)};