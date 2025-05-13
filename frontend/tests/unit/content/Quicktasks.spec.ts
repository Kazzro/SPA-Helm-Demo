import { describe, it, expect, beforeEach } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
//import vuetify from "vite-plugin-vuetify";
import Quicktasks from "../../../src/content/Quicktasks.vue";
import { createTestingPinia } from "@pinia/testing";
import { createTestingVuetify } from "../vuetify";
import { Transition } from "vue";
//import { useUserStore } from "../../../src/stores/usersStoreJSON";

describe("Quicktasks tests", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    const pinia = createTestingPinia();
    const vuetify = createTestingVuetify();

    let el = document.createElement("div");
    el.id = "app";
    document.body.appendChild(el);

    wrapper = mount(Quicktasks, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });

  it("renders Quicktasks correctly", () => {
    expect(wrapper.exists()).toBe(true);
    const containerWrapper = wrapper.find(".container");
    expect(containerWrapper.exists()).toBe(true);
    expect(containerWrapper.find('[data-test="createNote"]').exists()).toBe(
      true
    );
  });

  it("opens modal when clicking on create note card", async () => {
    let modal = wrapper.getComponent(Transition);
    expect(modal.find('[data-test="title"]').exists()).toBe(false);
    await wrapper.find('[data-test="createNote"]').trigger("click");
    modal = wrapper.getComponent(Transition);
    expect(modal.find('[data-test="title"]').exists()).toBe(true);
    expect(modal.find('[data-test="title"]').text()).toContain("Create note");
  });
});
