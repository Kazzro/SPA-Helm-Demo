import AuthBar from "../../../src/components/AuthBar.vue";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia } from "pinia";
import { VueWrapper, mount } from "@vue/test-utils";
import router from "../../../src/router";
import vuetify from "../../../src/plugins/vuetify";
import { Transition } from "vue";

describe("Authbar integration", () => {
  let wrapper: VueWrapper;

  let el = document.createElement("div");
  el.id = "app";
  document.body.appendChild(el);

  beforeEach(() => {
    wrapper = mount(AuthBar, {
      global: {
        plugins: [createPinia(), router, vuetify],
      },
    });
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("logs in test user", async () => {
    const userHeadline = wrapper.find('[data-test="userHeadline"');
    expect(userHeadline.exists()).toBe(true);
    expect(userHeadline.text()).toContain("unsigned");

    const loginBtn = wrapper.find('[data-test="Login"');
    expect(loginBtn.exists()).toBe(true);
    loginBtn.trigger("click");

    await wrapper.vm.$nextTick();

    const modal = wrapper.getComponent(Transition);

    const emailField = modal.find('[data-test="Email"');
    await emailField.find("input").setValue("test@test.test");

    const passwordField = modal.find('[data-test="Password"');
    await passwordField.find("input").setValue("password");

    const greenBtn = modal.find('[data-test="submitButton"]');
    expect(greenBtn.exists()).toBe(true);
    await greenBtn.trigger("click");
    expect(wrapper.emitted("ok")).toBe(true);

    await wrapper.vm.$nextTick();
    expect(userHeadline.text()).toContain("Leonard Nimoy");
  });
});
