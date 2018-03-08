import Vue from "vue";
import router from "@/routers";
import PostMenu from "./postMenu";
const prefixCls = "v-post-menu";

PostMenu.newInstance = properties => {
  const _props = properties || {};

  const Instance = new Vue({
    data: Object.assign(
      {},
      {
        visible: false
      },
      _props
    ),

    render(h) {
      const menusVNodes = [];
      this.menus.forEach(menu => {
        menusVNodes.push(
          h(
            "div",
            {
              class: `${prefixCls}-item _${menu.cls}`
            },
            [
              h("img", {
                class: `${prefixCls}-item-icon`,
                attrs: {
                  src: `${menu.src}`
                },
                on: {
                  click: () => {
                    router.push(`${menu.path}`);
                    this.$nextTick(() => {
                      this.close();
                    });
                  }
                }
              }),
              h(
                "div",
                {
                  class: `${prefixCls}-item-label`
                },
                menu.label
              )
            ]
          )
        );
      });

      const maskVNodes = [];
      maskVNodes.push(
        h("div", {
          attrs: {
            class: `${prefixCls}-mask`
          }
        })
      );

      const bodyVNodes = [];
      bodyVNodes.push(
        h(
          "div",
          {
            attrs: {
              class: `${prefixCls}-wrap`
            }
          },
          [
            h(
              PostMenu,
              {
                props: {
                  open: this.visible
                },
                on: {
                  "on-close": this.close
                }
              },
              [menusVNodes]
            )
          ]
        )
      );

      return h(
        "div",
        {
          attrs: {
            class: `${prefixCls}-modal`
          }
        },
        [maskVNodes, bodyVNodes]
      );
    },
    computed: {},
    methods: {
      close() {
        this.visible = false;
        this.onClose();
      },
      onClose() {
        this.$destroy();
        document.body.removeChild(this.$el);
        this.onRemove();
      },
      onRemove() {}
    }
  });

  const Parent = Instance.$mount();
  document.body.appendChild(Parent.$el);
  const Menu = Instance.$children[0];

  return {
    show(props) {
      Parent.onRemove = props.onRemove;
      Parent.visible = true;
    },
    remove() {
      Parent.visible = false;
      Parent.remove();
    },
    component: Menu
  };
};

export default PostMenu;
