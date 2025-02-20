const categories = document.querySelectorAll('.option');
let questionIndex = 0;
let questionArray;
let id = 0
categories.forEach((category)=>{
    category.addEventListener('click',(e)=>{
        e.preventDefault()
        const selected = category.textContent.trim();
        renderQuestions(selected)
    })
});
const header = document.querySelector('.header')
const QuestionSection = document.querySelector('.sectionsQuestion')
const optionSection = document.querySelector('.options')
const progress = document.querySelector('.progress')
const progressBar = document.querySelector('.progressbar')

async function renderQuestions(selected){

    header.textContent = selected
    QuestionSection.innerHTML=''
    optionSection.innerHTML=''
   const infoDiv = document.querySelector('.info')
   infoDiv.classList.remove('hide')
   progress.classList.remove('hide')

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
        selectedQuestion = questions.javaScript;
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
    handleOptions(options)
    // QuestionSection.textContent = selectedQuestion.questions

}
function renderCurrentQuestion(selectedQuestion,questionIndex ){
    QuestionSection.textContent = selectedQuestion[questionIndex].question
}
const optionsID = ['A','B','C','D']
function handleOptions(options) {
    options.forEach((option, index) => {
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
            }
            optionDiv.classList.add('selected');

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