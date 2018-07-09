import { shallowMount } from "@vue/test-utils";
import Message from "@/components/common/message.vue";

describe("@/components/common/message.vue", () => {
  it('Check props type when passed', () => {
    const types = [
      { type: "success", className: "Alert--Success" },
      { type: "warning", className: "Alert--Warning" },
      { type: "error", className: "Alert--Error" }
    ];
    
    types.map(({ type, className }) => {
      let wrapper = shallowMount(Message, {
        propsData: { type }
      });

      expect(wrapper.classes()).toContain(className);
    });
  });
});

