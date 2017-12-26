import Vue from 'vue'
import Message from './messageList'

Message.newInstance = props => {
  const _props = props || {}

  const Instance = new Vue({
    data: _props,
    render (h) {
      return h(Message, {
        props: _props
      })
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const msgs = Instance.$children[0]

  return {
    notice (msgProps) {
      msgs.add(msgProps)
    },
    remove (name) {
      msgs.close(name)
    },
    component: msgs,
    destroy (element) {
      msgs.closeAll()
      setTimeout(function () {
        document.body.removeChild(document.getElementsByClassName(element)[0])
      }, 500)
    }
  }
}

export default Message
