const categories = document.querySelectorAll('.option');
let questionIndex = 0;
let questionArray;
let id = 0
let score = 0
let Submit = false
let yourAnswers = []
categories.forEach((category)=>{
    category.addEventListener('click',(e)=>{
        e.preventDefault()
        const selected = category.textContent.trim();
        renderQuestions(selected)
        console.log(selected)
    })
});
const header = document.querySelector('.header')
const QuestionSection = document.querySelector('.sectionsQuestion')
const optionSection = document.querySelector('.options-section')
const progress = document.querySelector('.progress')
const progressBar = document.querySelector('.progressbar')
const nextButton = document.querySelector('.next-btn')
const buttonDiv = document.querySelector('.btn')

async function renderQuestions(selected){
    timeStamp()
    header.textContent = selected
    QuestionSection.innerHTML=''
    optionSection.innerHTML=''
   const infoDiv = document.querySelector('.info')
   infoDiv.classList.remove('hide')
   progress.classList.remove('hide')
   buttonDiv.classList.remove('hide')

    let questions = await fetchQuestion()
    let selectedQuestion;
  switch (selected){
    case 'HTML':
        selectedQuestion = questions.HTML;
        break
    case 'CSS':
        selectedQuestion = questions.CSS;
        break
    case 'javascript':
        selectedQuestion = questions.JavaScript;
        break
    case 'General Programming Knowledge':
        selectedQuestion = questions.General_Knowledge
        break
    default:
        console.log('No questions for this category')
  }
  questionArray = await selectedQuestion;
    console.log(selected)
    let options = selectedQuestion[questionIndex].options
    console.log(options)
    renderCurrentQuestion(selectedQuestion,questionIndex )
    const info = document.querySelector('.info')
            info.textContent = `Question ${questionIndex+1} of ${selectedQuestion.length}`
    const nextButton = createElement('button',
        {className: 'next-btn empty rounded-md',textContent:'Next'},[]
    )
    nextButton.setAttribute('disabled',true)
    buttonDiv.appendChild(nextButton)
    handleOptions(options,nextButton)
    // QuestionSection.textContent = selectedQuestion.questions
    nextButton.addEventListener('click',(e)=>{
        e.preventDefault();
        if (nextButton.hasAttribute('disabled')) {
            return
        }
        questionIndex += 1;
        checkAnswer(selectedQuestion,questionIndex-1)
        if(questionIndex < selectedQuestion.length){
             options = selectedQuestion[questionIndex].options
            renderCurrentQuestion(selectedQuestion,questionIndex)
            handleOptions(options,nextButton)
            progressBar.style.width = `${(questionIndex+1)/selectedQuestion.length*100}%`
            const info = document.querySelector('.info')
            info.textContent = `Question ${questionIndex+1} of ${selectedQuestion.length}`
            if(questionIndex === selectedQuestion.length-1){
                nextButton.textContent = 'Submit'
            }
        nextButton.classList.add('empty')
        }
        else{
            nextButton.classList.add('empty')
            progress.classList.add('hide')
            previewResult(score)
            if(score >=15){
                triggerConfetti()
            }
            Submit = true
            console.log('end of questions')
        }
    })

}
function renderCurrentQuestion(selectedQuestion,questionIndex ){
    QuestionSection.textContent = selectedQuestion[questionIndex].question

}
const optionsID = ['A','B','C','D']
function handleOptions(options,button=null) {
    optionSection.innerHTML='';
    if(button){
        button.setAttribute('disabled',true)
        button.classList.add('empty')
    }
    shuffle(options).forEach((option, index) => {
        const optionDiv = createElement(
            'div',
            {
                className: 'option rounded-md'
            },
            [
                createElement('label', {
                    className: 'flex gap-5 items-center labels'
                }, [
                    createElement('input', {
                        type: 'radio',
                        name: 'option',
                        value: option
                    }, []),
                    createElement('div', {
                        className: 'icon bg-gray-200 rounded-sm p-1',
                        textContent: `${index + 1}.`
                    }, []),
                    createElement('p', {
                        textContent: option
                    }, [])
                ]),
            ]
        );

        optionDiv.addEventListener('click', () => {
            const input = optionDiv.querySelector('input');
            if (!input.checked) {
                input.checked = true;
                if (button) {
                    button.removeAttribute('disabled');
                    button.classList.remove('empty');
                }
            }
            optionDiv.classList.add('selected');
            button.classList.remove('empty')
            const allOptions = optionSection.querySelectorAll('.option');
            allOptions.forEach(opt => {
                if (opt !== optionDiv) {
                    opt.classList.remove('selected');
                }
            });
        });

        optionSection.appendChild(optionDiv);
    });
}

function fetchQuestion(){
    return new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET','Data/question.json',true)
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    try {
                        const data =JSON.parse(xhr.responseText)
                        resolve(data)
                    } catch (error) {
                        console.log(error)
                        reject('failed to fetch data')
                    }
                }
            }
        }
        xhr.send()
    })
}
function createElement(tag, options={}, children=[]){
    const element = document.createElement(tag)
    Object.keys(options).forEach((key)=>{
        if(key==='style'){
            Object.assign(element.style, options[key])
        }else{
            element[key]=options[key]
        }
    });
    children.forEach((child)=> element.appendChild(child));
    return element;
}
function checkAnswer(selectedQuestion,questionIndex){
    const selectedOption = optionSection.querySelector('input:checked');
    if(selectedOption){
        const answer = selectedOption.value;
        const correctAnswer = selectedQuestion[questionIndex].correct_answer;
        if(answer === correctAnswer){
           score += 2
           yourAnswers.push(`${questionIndex +1}: ✔️ ${answer}`)
           console.log(yourAnswers)
        }else{
            yourAnswers.push(`${questionIndex +1}: ❌ ${answer} - ✔️ ${correctAnswer}`)
            console.log(yourAnswers)
        }
    }
}
function previewResult(score){
    const body = document.querySelector('.wrapper');
    const overlay = createElement(
        'div',
        {
            className:'absolute overlay w-full h-screen bg-gray-200 flex items-center justify-center'
        },
        [
            createElement('div',{className:'result rounded-md bg-white p-5'},[
                createElement('h3',{className: 'text-gray-600', textContent:'Result'},[]),
                createElement('p',{className: 'text-gray-600', textContent:`Your score is ${score} out of ${questionArray.length*2}`},[]),
               createElement('div',{className: 'flex gap-5'},[
                createElement('button',{textContent: 'view ', className: 'viewR-btn rounded-sm'},[]),
                createElement('button',{textContent:'Close',className:'close-btn rounded-sm'},[])
               ])
            ])
        ]
    );

    const closeButton = overlay.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        overlay.remove();
        console.log('close');
        window.location.reload()
    });
    const viewButton = overlay.querySelector('.viewR-btn');
    viewButton.addEventListener('click',()=>{
        viewResult()
    });
    body.appendChild(overlay)
}
function triggerConfetti(){
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
    });
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function timeStamp(){
    let timeUp = false;
    const countdownTime = new Date().getTime()+ 2 * 60 * 1000
    let timeText = '02:00';
    const wrapper = document.querySelector('.wrapper')
    const timeContainer = createElement(
        'div',
        {className: 'absolute z-10 w-full p-2 top-0 flex justify-end'},
        [
            createElement('div',{className: 'card w-44 bg-white rounded-sm p-2 flex flex-col '},[
                createElement('div',{className: 'flex head text-blue-500',textContent:'Time Left'},[]),
                createElement('div',{className:'cardBody text-center text-blue-500', textContent:`${timeText}`},[])
            ])
        ]
    )
    wrapper.appendChild(timeContainer)

    const cardBody = timeContainer.querySelector('.cardBody');
    const x = setInterval(()=>{
        const now = new Date().getTime();
        const distance = countdownTime - now

        const min =Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const sec = Math.floor((distance % (1000 * 60)) / 1000);
        timeText = `${formatTime(min)}: ${formatTime(sec)}`
        cardBody.textContent = timeText;
        if(distance < 0){
            clearInterval(x);
            cardBody.textContent = 'TIME UP';
            timeUp = true;
            previewResult(score)
        }
        if(Submit){
            clearInterval(x)
        }
    },1000)
}
function formatTime(time) {
    return time < 10 ? "0" + time : time;
}
function viewResult() {
    const overlay = document.querySelector('.overlay');
    overlay.innerHTML = '';
    const resultDiv = createElement('div', { className: 'result rounded-md bg-white p-5' }, [
        createElement('div', { className: 'cardHead text-center' }, [
            createElement('h3', { textContent: 'Your Answers' }, [])
        ]),
        createElement('div', { className: 'cardBody flex flex-col' }, [
            createElement('ul', { className: 'list' },
                yourAnswers.map((answer) => createElement('li', { textContent: answer }, []))
            )
        ]),
        createElement('div', { className: 'cardFooter flex justify-center' }, [
            createElement('button', { textContent: 'Close', className: 'close-btn rounded-sm' }, [])
        ])
    ]);
    const closeButton = resultDiv.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        overlay.remove();
        console.log('close');
        window.location.reload()
    });
    overlay.appendChild(resultDiv);
}