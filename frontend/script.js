const userId = localStorage.getItem('userID')

// Fetch all quizzes onload page browseQuizzes.html
function getAllQuizzes(){
    fetch('http://localhost:3000/users/')
    .then(res => {
        if(res.ok){
            console.log('SUCCESS')
            return res.json()
        }else{
            console.log('FAILED')
        }
    })
    .then(data => {
        let table = document.getElementById("table")
        for(let i = 0 ; i < data.length; i++){
            for(let j = 0; j < data[i].quiz.length; j++){
                let row = table.insertRow(i+1)
                let cell0 = row.insertCell(0)
                cell0.innerText = data[i].quiz[j].name+""
                let cell1 = row.insertCell(1)
                cell1.innerText = data[i].name+""
                let cell2 = row.insertCell(2)
                let authorId = data[i]._id+""
                let quizId = data[i].quiz[j]._id+""
                let quizName = data[i].quiz[j].name+""
                cell2.innerHTML = "<button onclick='gotoQuiz("+"\""+authorId+"\""+","+"\""+quizId+"\""+","+"\""+quizName+"\""+")'>Start</button>"
            }
        }
    })
}

//Triggers when the 'start' button of a quiz is clicked
function gotoQuiz(authorId, quizId,quizName){
    document.getElementById('homeBtn').style.visibility="hidden"
    let answers = []
    let header = document.getElementById("header")
    header.innerHTML = "<h1>Quiz</h1>"
    let table = document.getElementById("table")
    table.innerHTML = "<tr><th>Question</th><th>Answer</th></tr>"

    //Fetch the quiz question set
    fetch('http://localhost:3000/users/'+authorId)
    .then(res => {
        if(res.ok){
            console.log('SUCCESS')
            return res.json()
        }else{
            console.log('FAILED')
        }
    })
    .then(data => {
        let quizzes = data.quiz
        let questions = ""
        for(let i = 0 ; i < quizzes.length; i++){
            if(quizzes[i]._id.localeCompare(quizId) === 0){
                questions = quizzes[i].questions
            }
        }
        let table = document.getElementById("table")
        for(let i = 0 ; i < questions.length; i++){
            let row = table.insertRow(i+1)
            let cell0 = row.insertCell(0)
            cell0.innerText = questions[i].question+""
            let cell1 = row.insertCell(1)
            cell1.innerHTML = "<input>"
            answers.push(questions[i].answer+"")
        }

        

        document.getElementById("submit").innerHTML = "<button onclick='updateStats(\""+answers+"\""+","+"\""+quizName+"\""+")'>Submit</button>"


    })
}

//Triggers when the 'submit' button on a question set is clicked
function updateStats(answer, quizName){
    let inputs = document.querySelectorAll("input")
    let answers = answer.split(',')
    let userAns = []
    let score = 0
    let attempts = []
    let completion = true
    for(let i = 0; i < answers.length; i++){
        if(inputs[i].value.localeCompare("") === 0){
            completion = false
        }
        userAns.push(inputs[i].value)
    }
    for(let i = 0; i < answers.length; i++){
        if(answers[i].localeCompare(userAns[i]) === 0){
            score++
        }
    }

    alert("Your score is "+score+"/"+answers.length)

    document.getElementById("back").innerHTML = "<button onclick='gotoActionPage()'>Back</button>"

    //Update the history
    fetch('http://localhost:3000/users/'+userId)
    .then(res => {
        if(res.ok){
            console.log('SUCCESS')
            return res.json()
        }else{
            console.log('FAILED')
        }
    })
    .then(data => {
        attempts = data.attempted
        attempts.push({completion: completion, quizName: quizName, score: score})

        fetch('http://localhost:3000/users/'+userId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attempted: attempts
            })
        }).then(res => {
            if(res.ok){
                console.log('SUCCESS')
                return res.json()
            }else{
                console.log('FAILED')
            }
        })
    })

}

//Triggers when 'login' button on index.html is clicked
function loginOnClick(){
    let id = document.getElementById("idbox").value
    if(id.localeCompare("") === 0){
        alert("Login failed, please check if the given ID is correct!")
        return
    }
    fetch('http://localhost:3000/users/'+id)
    .then(res => {
        if(res.ok){
            console.log('SUCCESS')
            localStorage.setItem('userID', id)
            gotoActionPage()
            return res.json()
        }else{
            console.log('FAILED')
            alert("Login failed, please check if the given ID is correct!")
        }
    })
    .then(data => {
        console.log(data)
    })
}

//Triggers when 'new user' button on index.html is clicked
function signupOnClick(){
    let name = document.getElementById("idbox").value
    if(name.localeCompare("") === 0){
        alert("User Name Cannot be Empty!")
        return
    }
    fetch('http://localhost:3000/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name+""
        })
    }).then(res => {
        if(res.ok){
            console.log('SUCCESS')
            document.getElementById('ok').style.visibility="visible"
            return res.json()
        }else{
            console.log('FAILED')
        }
    })
    .then(data => {
        console.log(data)
        localStorage.setItem('userID', data._id)
        document.getElementById("phrase").innerText = data._id + " is your ID, you may login by using it next time!"
    })
}

//Fetch the user history onload page statistics.html
function getStatistics(){
    fetch('http://localhost:3000/users/'+userId)
    .then(res => {
        if(res.ok){
            console.log('SUCCESS')
            return res.json()
        }else{
            console.log('FAILED')
        }
    })
    .then(data => {
        let table = document.getElementById("table")
        for(let i = 0 ; i < data.attempted.length; i++){
            let row = table.insertRow(i+1)
            let cell0 = row.insertCell(0)
            cell0.innerText = data.attempted[i].quizName+""
            let cell1 = row.insertCell(1)
            cell1.innerText = (data.attempted[i].completion === true) ? "Completed" : "Incompleted"
            let cell2 = row.insertCell(2)
            cell2.innerText = data.attempted[i].score+""
        }
    })
}

//Fetch the current user's question set
function getMyQuizzes(){
    fetch('http://localhost:3000/users/'+userId)
    .then(res => {
        if(res.ok){
            console.log('SUCCESS')
            return res.json()
        }else{
            console.log('FAILED')
        }
    })
    .then(data => {
        let table = document.getElementById("table")
        if(data.quiz.length === 0){
            table.style.visibility="hidden"
        }
        for(let i = 0; i < data.quiz.length; i++){
            let row = table.insertRow(i+1)
            let cell0 = row.insertCell(0)
            cell0.innerText = data.quiz[i].name+""
            let cell1 = row.insertCell(1)
            let quizId = data.quiz[i]._id
            cell1.innerHTML = "<button onclick='deleteQuiz("+"\""+quizId+"\""+")'>Delete</button>"
        }
        
    })

}

//Triggers when the 'delete' button of a quiz is clicked on page myQuiz.html
function deleteQuiz(quizId){
    fetch('http://localhost:3000/users/'+userId)
    .then(res => {
        if(res.ok){
            console.log('SUCCESS')
            return res.json()
        }else{
            console.log('FAILED')
        }
    })
    .then(data => {
        let quizzes = []
        for(let i = 0; i < data.quiz.length; i++){
            if(data.quiz[i]._id.localeCompare(quizId) !== 0){
                quizzes.push(data.quiz[i])
            }
        }

        fetch('http://localhost:3000/users/'+userId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quiz: quizzes
            })
        }).then(res => {
            if(res.ok){
                console.log('SUCCESS')
                location.reload()
            }else{
                console.log('FAILED')
            }
        })

    })    

}

//Triggers when the 'go to add' button is clicked on page myQuiz.html
//Assert UI elements for user inputs to add a new question set
function addQuiz(){
    document.getElementById("table").style.visibility="visible"

    let newQuizName = document.getElementById("quizNameInput").value
    if(newQuizName.localeCompare("") === 0){
        alert("Quiz Name Cannot be Empty!")
        return
    }
    let quizNum = document.getElementById("numInput").value
    if(!Number.isInteger(parseInt(quizNum))){
        alert("Invalid Number of Questions!")
        return
    }
    quizNum = Math.abs(parseInt(quizNum))

    document.getElementById('quizNameInput').style.visibility="hidden"
    document.getElementById('numInput').style.visibility="hidden"
    document.getElementById('add').style.visibility="hidden"

    let table = document.getElementById("table")
    table.innerHTML = "<tr><th>Question</th><th>Answer</th></tr>"

    for(let i = 0; i < quizNum; i++){
        let row = table.insertRow(i+1)
        let cell0 = row.insertCell(0)
        cell0.innerHTML = "<input placeholder=\"Question "+(i+1)+"\">"
        let cell1 = row.insertCell(1)
        cell1.innerHTML = "<input placeholder=\"Answer "+(i+1)+"\">"
    }

    document.getElementById("done").innerHTML = "<button onclick='postQuiz(\""+newQuizName+"\")'>Post</button>"
}

//Triggers the 'post' button is clicked on page myQuiz.html
function postQuiz(quizName){
    let inputs = document.querySelectorAll("input")
    let questions = []
    let answers = []
    let newQuiz
    for(let i = 0; i < inputs.length-2; i++){
        if(inputs[i].value.localeCompare("") === 0){
            alert("Question or Answer Cannot be Empty!")
            return
        }
        if(i%2 === 0){
            questions.push(inputs[i].value)
        }else{
            answers.push(inputs[i].value)
        }
    }
    console.log(questions)
    console.log(answers)
    console.log(quizName)
    let questionSet = []
    for(let i = 0; i < questions.length; i++){
        questionSet.push({question: questions[i], answer: answers[i]})
    }
    newQuiz = {name: quizName, questions: questionSet}

    //Patch the new question set
    fetch('http://localhost:3000/users/'+userId)
    .then(res => {
        if(res.ok){
            console.log('SUCCESS')
            return res.json()
        }else{
            console.log('FAILED')
        }
    })
    .then(data => {
        quizzes = data.quiz
        quizzes.push(newQuiz)

        console.log(quizzes)
        fetch('http://localhost:3000/users/'+userId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quiz: quizzes
            })
        }).then(res => {
            if(res.ok){
                console.log('SUCCESS')
                location.reload()
                return res.json()
            }else{
                console.log('FAILED')
            }
        })
    })

}

//Navigation functions
function gotoActionPage(){
    location.href = 'action.html'
}

function gotoBrowse(){
    location.href = 'browseQuizzes.html'
}

function gotoStatistics(){
    location.href = 'statistics.html'
}

function gotoMyQuiz(){
    location.href = 'myQuiz.html'
}

function logout(){
    location.href = "index.html"
}