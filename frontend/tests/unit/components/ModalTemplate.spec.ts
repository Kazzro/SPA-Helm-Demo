import ModalTemplateVue from "../../../src/components/ModalTemplate.vue";
import { describe, it, expect, beforeEach } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import { Transition } from "vue";

//import { Modal } from "ant-design-vue";

describe("ModalTemplate", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    let el = document.createElement("div");
    el.id = "app";
    document.body.appendChild(el);
    wrapper = mount(ModalTemplateVue, {
      props: {
        open: true,
        title: "ModalTemplate Testing Title",
      },
      slots: {
        default: '<p class="testdata">ModalTemplate Testing Content</p>',
      },
    });
  });

  it("renders title", async () => {
    await wrapper.vm.$nextTick();
    const modal = wrapper.getComponent(Transition);

    const title = modal.find('[data-test="title"]');
    expect(title.text()).toContain("ModalTemplate Testing Title");
  });

  it("renders content", async () => {
    await wrapper.vm.$nextTick();
    const modal = wrapper.getComponent(Transition);

    const content = modal.find('[data-test="content"]');
    expect(content.text()).toContain("ModalTemplate Testing Content");
  });

  it("red button exists", async () => {
    await wrapper.vm.$nextTick();
    const modal = wrapper.getComponent(Transition);

    const redBtn = modal.find('[data-test="cancelButton"]');
    expect(redBtn.exists()).toBe(true);
  });

  it("emits cancel", async () => {
    await wrapper.vm.$nextTick();
    const modal = wrapper.getComponent(Transition);

    const redBtn = modal.find('[data-test="cancelButton"]');
    redBtn.trigger("click");
    expect(wrapper.emitted("cancel")).toBeTruthy();
  });

  it("green button exists", async () => {
    await wrapper.vm.$nextTick();
    const modal = wrapper.getComponent(Transition);

    const greenBtn = modal.find('[data-test="submitButton"]');
    expect(greenBtn.exists()).toBe(true);
  });

  it("emits ok", async () => {
    await wrapper.vm.$nextTick();
    const modal = wrapper.getComponent(Transition);

    const greenBtn = modal.find('[data-test="submitButton"]');
    greenBtn.trigger("click");
    expect(wrapper.emitted("ok")).toBeTruthy();
  });
});
