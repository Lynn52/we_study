const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');
router.use(express.json());

router.post('/quiz',function(req,res){
    const classId = req.query.classId;
    models.Quiz.create({...req.body, classId: classId}).then((quiz)=>{
        res.status(200).send(quiz);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('퀴즈 생성 에러');
    })
})

router.get('/quizs',function(req,res){
    const classId = req.query.classId;
    models.Quiz.findAll({where:{classId: classId}}).then((quizs)=>{
        res.status(200).send(quizs);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('퀴즈 리스트 불러오기 에러');
    })
})

router.get('/quiz',function(req,res){
    const quizId = req.query.quizId;
    models.Quiz.findByPk(quizId,{
        include:[
            {
                model: models.Question,
                include:[{
                    model: models.Choice
                }]
            },
        ],
        order: [[models.Question, 'createdAt', 'ASC']],
    }).then(quiz=>{
        res.status(200).send(quiz);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('퀴즈 불러오기 에러');
    })
})

router.put('/quiz',function(req,res){
    const quizId = req.query.quizId;
    models.Quiz.update(req.body, {where:{id: quizId}}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('퀴즈 수정 에러');
    })
})

router.delete('/quiz',function(req,res){
    const quizId = req.query.quizId;
    models.Quiz.destroy({where:{id: quizId}}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('퀴즈 삭제 오류');
    })
})

router.post('/question',function(req,res){
    const quizId = req.query.quizId;
    models.Question.create({...req.body, quizId: quizId}).then((question)=>{
        res.status(200).send(question);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('서술형, 단답형 생성 에러');
    })
})

router.put('/question',function(req,res){
    const questionId = req.query.questionId;
    models.Question.update(req.body,{where:{id:questionId}}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('퀴즈 수정 에러 발생');
    })
})

router.delete('/question',function(req,res){
    const questionId = req.query.questionId;
    models.Question.destroy({where:{id:questionId}}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('Question 삭제 에러');
    })
})

router.post('/question/choice',function(req,res){
    const quizId = req.query.quizId;
    const optionText  = req.body.optionText;
    models.Question.create({...req.body, quizId: quizId}).then((question)=>{
        const modifiedOptions = optionText.map(option => ({ ...option, questionId: question.id }));
        models.Choice.bulkCreate(modifiedOptions).then((choice)=>{
            res.status(200).send({...question.dataValues,Choices:choice });
        }).catch(err=>{
            console.log(err);
            res.status(500).send('선택지 생성 에러');
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).send('퀴즈 생성 에러');
    })
})

router.put('/choice',function(req,res){
    const choiceId = req.query.choiceId;
    models.Choice.update(req.body,{where:{id:choiceId}}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('Choice 수정 에러');
    })
})

router.delete('/choice',function(req,res){
    const choiceId = req.query.choiceId;
    models.Choice.destroy({where:{id:choiceId}}).then(()=>{
        res,sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('Choice 삭제 에러');
    })
})

router.post('/studentAnswer',function(req,res){
    const userId = req.session.passport.user;
    const quizId = req.query.quizId;
    const saveData = req.body.map(item => ({ ...item, userId: userId }));

    function zipArrays(arr1, arr2) {
        return arr1.map((item, index) => [item, arr2[index]]);
    }

    models.StudentAnswer.bulkCreate(saveData).then((studentAnswers)=>{
        models.Question.findAll({
            raw:true,
            where:{quizId: quizId},
            order:[['createdAt', 'ASC']]
        }).then(questions=>{
        // 이제 여기에 채점 로직을 구현 하면 된다!
        console.log(questions)
        for (const [studentAnswer, question] of zipArrays(studentAnswers, questions)) {
            console.log(studentAnswer)
            console.log(question)
            if(question.questionType === "서술형"){
                break;
            }
            if(studentAnswer.answer === question.answer){
                models.StudentAnswer.update({check: true}, {where:{id: studentAnswer.id}}).catch(err=>{
                    console.log(err);
                    res.status(500).send('채점 에러 발생')
                })
            }else{
                models.StudentAnswer.update({check: false}, {where:{id: studentAnswer.id}}).catch(err=>{
                    console.log(err);
                    res.status(500).send('채점 에러 발생')
                })
            }
        }
        res.sendStatus(200);

        }).catch(err=>{
            console.log(err);
            res.status(500).send('채점 에러')
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).send('학생 정답지 생성 에러');
    })
})

// router.post('/studentAnswer', function(req, res) {
//     const userId = req.session.passport.user;
//     const quizId = req.query.quizId;
//     const saveData = req.body.map(item => ({ ...item, userId: userId }));

//     function zipArrays(arr1, arr2) {
//         return arr1.map((item, index) => [item, arr2[index]]);
//     }

//     models.StudentAnswer.bulkCreate(saveData).then((studentAnswers) => {
//         models.Question.findAll({
//             raw: true,
//             where: { quizId: quizId },
//             order: [['createdAt', 'ASC']]
//         }).then(questions => {
//             for (const [studentAnswer, question] of zipArrays(studentAnswers, questions)) {
//                 if (question.questionType === "서술형") {
//                     break;
//                 }

//                 // 답안과 정답을 비교하기 위해 두 배열을 문자열로 변환
//                 const studentAnswerStr = Array.isArray(studentAnswer.answer) ?
//                     studentAnswer.answer.sort().toString() : studentAnswer.answer.toString();
//                 const correctAnswerStr = Array.isArray(question.answer) ?
//                     question.answer.sort().toString() : question.answer.toString();

//                 if (studentAnswerStr.trim() === correctAnswerStr.trim()) {
//                     models.StudentAnswer.update({ check: true }, { where: { id: studentAnswer.id } }).catch(err => {
//                         console.log(err);
//                         res.status(500).send('채점 에러 발생');
//                     });
//                 } else {
//                     models.StudentAnswer.update({ check: false }, { where: { id: studentAnswer.id } }).catch(err => {
//                         console.log(err);
//                         res.status(500).send('채점 에러 발생');
//                     });
//                 }
//             }
//             res.sendStatus(200);
//         }).catch(err => {
//             console.log(err);
//             res.status(500).send('채점 에러');
//         });
//     }).catch(err => {
//         console.log(err);
//         res.status(500).send('학생 정답지 생성 에러');
//     });
// });



router.get('/studentAnswer',function(req,res){
    const userId = req.query.userId;
    const quizId = req.query.quizId;
    models.Quiz.findByPk(quizId,{
        include:[
            {
                model: models.Question,
                include:[
                    {
                    model: models.StudentAnswer,
                    where:{
                        userId: userId
                    }
                    },
                    {
                        model: models.Choice,
                    },
            ]}
        ]
    }).then((quiz)=>{
        res.status(200).send(quiz);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('학생 답안지 조회 에러');
    })
})
router.get('/studentAnswers',function(req,res){
    const classId = req.query.classId;
    models.Quiz.findAll({
        where:{
            classId: classId
        },
        include:[
            {
                model: models.Question,                
                // required: true,
                // attributes:[],
                include:[{
                    model: models.StudentAnswer,
                    // attributes:[],
                    // required: true,
                    include:[{
                        model: models.User,
                        attributes:['id','nickName']
                    }]
                }]
            }
        ],
        group:['id','Questions.StudentAnswers.User.id']
    }).then((quiz)=>{
        res.status(200).send(quiz);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('학생 답안지 조회 에러');
    })
})

router.put('/studentAnswer',function(req,res){
    const answerId = req.query.answerId;
    models.StudentAnswer.update(req.body,{where:{id:answerId}}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(500).send('정답 변경 에러');
    })
})

router.get('/student/quiz/grade', function(req,res){
    const classId = req.query.classId;
    models.sequelize.query(`
    select users.nick_name, quizzes.title, SUM(CASE WHEN studentAnswers.check=true THEN questions.score ELSE 0 END) AS grade, studentAnswers.updated_at
    from quizzes
    left outer join questions
    on quizzes.id = questions.quiz_id
    join studentAnswers
    on questions.id = studentAnswers.question_id
    left outer join users
    on studentAnswers.user_id = users.id
    where quizzes.class_id = ${classId}
    group by quizzes.id, studentAnswers.user_id;`
    ).then((data)=>{
        res.status(200).send(data[0]);
    }).catch(err=>{
        console.log(err);
    })
})
module.exports = router;