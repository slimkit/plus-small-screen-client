import Modal from "./modalInstance";
import pay from "./components/pay";
import commentInpt from "./components/commentInput";
import "./modal.less";

let modalInstance;
const prefixCls = "v-modal";

function getModalInstance(render = undefined) {
  modalInstance = modalInstance || Modal.newInstance({ render });
  return modalInstance;
}

function showModal(options = {}) {
  const render = "render" in options ? options.render : undefined;
  let instance = getModalInstance(render);
  options.onRemove = function() {
    modalInstance = null;
  };

  instance.show(options);
}

/**
 * 显示默认弹窗
 * @author jsonleex <jsonlseex@163.com>
 */
Modal.show = options => {
  return showModal(options);
};

/**
 * 移除当前弹窗
 * @author jsonleex <jsonlseex@163.com>
 */
Modal.remove = () => {
  if (!modalInstance) {
    return false;
  }
  const instance = getModalInstance();
  instance.remove();
};

/**
 * 提示弹窗
 */
Modal.info = (options = {}) => {
  options = Object.assign(
    {
      title: "提示"
    },
    options,
    {
      maskClosable: false
    }
  );
  const render = h => {
    return h(
      "div",
      {
        class: `${prefixCls}-info`
      },
      [
        h(
          "div",
          {
            directives: [
              {
                name: "show",
                value: !!options.title
              }
            ],
            class: `${prefixCls}-info-head`
          },
          options.title
        ),
        h(
          "div",
          {
            class: `${prefixCls}-info-body`
          },
          [options.render(h)]
        ),
        h(
          "div",
          {
            class: `${prefixCls}-info-foot`
          },
          [
            h(
              "button",
              {
                on: {
                  click: () => {
                    modalInstance.remove();
                  }
                }
              },
              "取消"
            )
          ]
        )
      ]
    );
  };

  return showModal({ ...options, render });
};

/**
 * 支付弹窗
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Object} options
 * @return {[type]}
 */
Modal.pay = (options = {}) => {
  // content: 提示信息
  // price: 积分
  // onOk: 回调函数
  const { content, price, onOk } = options;
  if (!price) {
    throw new Error('"price" is required');
  }
  return showModal({
    render(h) {
      return h(pay, {
        on: {
          "on-close": Modal.remove,
          "on-ok": cb => {
            if (typeof onOk === "function") {
              onOk(cb);
            }
          }
        },
        props: {
          content,
          price
        }
      });
    }
  });
};

/**
 * 公共评论输入框
 *
 * options: {
 *  placeholder: {
 *    type: String,
 *    default: '随便说说~',
 *    requried: true
 *  },
 *  maxlength: Number,
 *  onOk: Function
 * }
 */
Modal.commentInpt = (options = {}) => {
  let onOk = () => {};
  if ("onOk" in options) {
    onOk = options.onOk;
  }
  const _props = {
    maskClosable: true,
    render(h) {
      return h(commentInpt, {
        on: {
          "on-ok": onOk
        },
        props: options
      });
    }
  };
  return showModal(_props);
};
export default Modal;
// export default {
//   install(vue) {
//     if (this.installed) return
//     vue.prototype.$Modal = Modal
//     vue.prototype.$pay = Modal.pay
//     vue.prototype.$ShowCommentInput = Modal.commentInpt
//   }
// }
