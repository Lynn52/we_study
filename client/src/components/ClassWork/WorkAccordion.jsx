import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography, Grid, Accordion, AccordionDetails, AccordionSummary, Stack, Button } from '@mui/material';

export default function WorkAccordion({ isTeacher, assignments, topicId }) {

  useEffect(() => {
    // filteredAssignments 배열 내의 모든 객체의 topicId를 출력
    console.log('assignments:', assignments);
  }, [assignments]);


  return (
    <>
      {assignments && assignments.map((assignment, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id={`work-header-${index}`}
          >
            <Grid container spacing={0} sx={{ alignItems:'center'}}>
              <Grid item xs={6}>
                <Typography variant='h6'>{assignment.title}</Typography>
              </Grid>
              <Grid item xs={6} sx={{paddingRight:'5px'}}>
                <Typography variant='caption' sx={{display:'flex', justifyContent:'flex-end'}}>{assignment.createdAt}</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails sx={{ whiteSpace: 'pre-line' }}>
            {assignment.description}
            {isTeacher&& (
              <Stack direction="row" justifyContent="flex-end" gap={1} sx={{marginTop:'15px'}}>
                <Link to={{
                  pathname: `/mypage/classes/${topicId}/${assignment.id}/worksforteacher`,
                  state: { assignment: assignment }
                  }}>
                  <Button variant="outlined">📎 제출된 과제 확인하기</Button>
                </Link>
                <Button variant="outlined">삭제</Button>
                <Button variant="outlined">수정</Button>
              </Stack>
            )}
            {isTeacher&& (
              <Stack direction="row" justifyContent="flex-end" gap={1} sx={{marginTop:'15px'}}>
                <Link to={`/mypage/classes/:classId/worksforstudent`}>
                  <Button variant="outlined">📎 과제 제출하기</Button>
                </Link>
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
