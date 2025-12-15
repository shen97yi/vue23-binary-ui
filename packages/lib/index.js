import MyButton from './button'
import MyTinyButton from './tiny-button'
import MyTinyRadio from './tiny-radio'
import Choice from './components/QuestionType/Choice'
import Completion from './components/QuestionType/Completion'
import Judge from './components/QuestionType/Judge'
import "@/styles/index.scss"
import "@/styles/variables.scss"
import "@/styles/mixin.scss"
export { 
  MyButton, 
  MyTinyButton,
  MyTinyRadio,
  Choice,
  Completion,
  Judge
}

const components = [
  MyButton, 
  MyTinyButton,
  MyTinyRadio,
  Choice,
  Completion,
  Judge
]

const install = app => {
  components.forEach(comp => app.use(comp))
}

export default { install }