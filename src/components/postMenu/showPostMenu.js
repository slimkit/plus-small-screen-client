import PostMenu from './postMenuInstance'
import WENZI from '@/images/ico_word@3x.png'
import PIC from '@/images/ico_potoablum@3x.png'
import TOUGAO from '@/images/ico_contribute@3x.png'
import CHECKIN from '@/images/ico_attendance@3x.png'
import QUESTION from '@/images/ico_question@3x.png'
import FATIE from '@/images/ico_fatie@3x.png'
let menuInstance
const
  menus = [{
    label: '文字',
    src: WENZI,
    cls: 'wenzi',
    path: '/post/wenzi'
  }, {
    label: '图片',
    src: PIC,
    cls: 'pic',
    path: '/post/pic'
  }, {
    label: '投稿',
    src: TOUGAO,
    cls: 'tougao',
    path: '/post/release'
  }, {
    label: '签到',
    src: CHECKIN,
    cls: 'check-in',
    path: '/post/checkin'
  }, {
    label: '提问',
    src: QUESTION,
    cls: 'check-in',
    path: '/post/question'
  }, {
    label: '发帖',
    src: FATIE,
    cls: 'check-in',
    path: '/post/fatie'
  }]

function getInputInstance() {
  menuInstance = menuInstance || PostMenu.newInstance({
    menus
  })
  return menuInstance
}

function showInput(options) {
  const instance = getInputInstance()
  options.onRemove = () => {
    menuInstance = null
  }
  instance.show(options)
}

export default {
  name: 'PostMenu',
  show(options = {}) {
    return showInput(options)
  },
  remove() {
    if (!menuInstance) {
      return false
    }
    const instance = getInputInstance()
    instance.remove()
  },
  config({ menus = [] }) {

  }
}
