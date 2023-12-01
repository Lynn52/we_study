import { Stack, Button, FormControlLabel, Checkbox, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';


export default function StudentAnswer(){
    const {quizId, studentId} = useParams();
    const [quiz, setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);

    function getAnswer(){
        axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/studentAnswer?quizId=${quizId}&userId=${studentId}`, { withCredentials: true }).then((response)=>{
            console.log(response.data)
            setQuiz(response.data);
            setQuestions(response.data.Questions);
        }).catch(err=>{
            console.log(err)
        })    
    }
    function editAnswer(questionId, target){
        console.log(target)
        axios.put(`${import.meta.env.VITE_SERVER_ADDRESS}/studentAnswer?answerId=${target.id}`,target ,{ withCredentials: true }).then(()=>{
            setQuestions(questions.map(question=>(question.id === questionId? {...question, StudentAnswers:[target]}: question)));
        }).catch(err=>{ 
            console.log(err);
        })
    }
    
    useEffect(()=>{
        getAnswer()
        console.log('questions:',questions)
    },[])
    return(
        <Stack        
        sx={{
            direction: 'column',
            marginTop: '115px',
            marginLeft: '320px',
            marginRight: '50px',
            marginBottom: '150px', 
        }}>
        {
            quiz &&(
                <Stack sx={{justifyContent:'center', alignItems:'center'}}>
                    <Typography variant='h3' fontWeight={'bold'}>{quiz.title}</Typography>
                    <Typography variant='h6' sx={{mt:3}}>퀴즈 응시 기간 : {dayjs(quiz.startDateTime).format('YYYY-MM-DD hh:mm A')} ~ {dayjs(quiz.dueDateTime).format('YYYY-MM-DD hh:mm A')}</Typography>
                    <Typography variant='subtitle1' sx={{
                        mt:1,
                        wordBreak:'keep-all',
                        }}>
                        {quiz.description}
                    </Typography>
                </Stack>
            )
        }
        <Stack sx={{justifyContent:'center', alignItems:'center', mt:5}}>
        {
            questions&& (
                questions.map((question, index)=>{
                    return(
                        <Stack
                            direction='row'
                            sx={{
                                mt: 2,
                                mb: 1,
                                width: '60rem',
                                border: 
                                    question.StudentAnswers.some(answer=>answer.check === false) ? '2px solid #FFCCCC'
                                    : (question.StudentAnswers.some(answer=>answer.check === null) ? '2px solid #FFD700'
                                    : '0.5px solid black'),
                                borderRadius: '10px',
                                padding: '1.5rem',
                                backgroundColor: 
                                    question.StudentAnswers.some(answer => answer.check === false) ? '#FFEFEF' 
                                    : (question.StudentAnswers.every(answer => answer.check === null) ? '#FFFFCC' 
                                    : ''),
                            }}
                            >
                        <Stack direction='column' sx={{width:'50%'}}>
                            <Stack direction='row' sx={{justifyContent:'space-between'}}>
                                <Typography variant='h6'>[ 문제 {index+1} ]</Typography>
                                <Typography sx={{pr:'1.5rem'}}>[ 배점 ] {question.score}점</Typography>
                            </Stack>
                                
                            <Stack sx={{mt:2, mb:3, wordBreak:'keep-all'}}>
                                <Typography variant='subtitle1'>{question.title}</Typography>
                            </Stack>
                            {
                            question.Choices.length !== 0 &&
                                question.Choices.map((choice, choiceIdx) => (
                                <Stack direction='column' key={choiceIdx} >
                                    <Typography sx={{wordBreak:'keep-all'}}>{`${choiceIdx + 1}) ${choice.optionText}`}</Typography>
                                </Stack>
                                ))
                            }
                        </Stack>
                        <Stack direction='column' spacing={3} sx={{width:'50%', justifyContent:'space-evenly',pl:'1.5rem'}}>
                        <Stack direction='column'>
                            <Typography variant='h6'>[ 정답 ]</Typography>
                            <Typography variant='subtitle1' sx={{wordBreak:'keep-all'}}>{question.answer}</Typography>
                        </Stack>
                        <Stack direction='column'>
                            <Typography variant='h6'>[ 정답의 근거 ]</Typography>
                            <Typography variant='subtitle1' sx={{wordBreak:'keep-all'}}>{question.reason}</Typography>
                        </Stack>
                        <>
                        <div>문제: {question.title}</div>
                        <div>배점: {question.score}</div>
                        <div>정답: {question.answer}</div>
                        {
                            question.Choices.length !==0?(
                                        question.Choices.map((choice, choiceIdx)=>{
                                            return(
                                                <div>{choice.optionText}</div>
                                            )}
                            )): null
                        }
                        {
                            question.StudentAnswers.map(studentAnswer=>{
                                return(
                                    <>
                                        <Stack direction='column' sx={{mt:2}}>
                                            <Stack direction='row' sx={{justifyContent:"space-between"}}>
                                                <Typography variant='h6'>[ 학생 답변 ]</Typography>
                                                <Stack>
                                                    <Typography variant='h6'>
                                                        {studentAnswer.check === true ? '( 정답 )' : studentAnswer.check === false?  '( 오답 )' : '( 미채점 )'}
                                                    </Typography>
                                                </Stack>
                                                
                                            </Stack>
                                            <Typography variant='subtitle1' sx={{wordBreak:'keep-all'}}>{studentAnswer.answer}</Typography>
                                        </Stack>
                                        <FormControlLabel
                                            control={<Checkbox value={studentAnswer.check}
                                            onChange={(e)=>{
                                                editAnswer(question.id, {...studentAnswer, check:e.target.checked})}} />}
                                            label="채점 수정" 
                                            sx={{justifyContent:'flex-end'}}
                                            />
                                    </>
                                )
                            })
                        }
                        </Stack>
                        </Stack>    
                    )
                })
            )
        }
        </Stack>
        </Stack>
    )
}