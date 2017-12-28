import CommentInput from './commentInputTnstance'

let inputInstance

function getInputInstance() {
  inputInstance = inputInstance || CommentInput.newInstance()
  return inputInstance
}

function showInput(options) {
  let instance = getInputInstance()
  options.onRemove = () => {
    inputInstance = null
  }
  instance.show(options)
}

export default {
  name: 'CommentInput',
  show(options = {}) {
    options.placeholder = options.placeholder
    return showInput(options)
  },
  remove() {
    if (!inputInstance) {
      return false
    }
    const instance = getInputInstance()
    instance.remove()
  }
}
