import { mount } from "@vue/test-utils";
import Quicktasks from "../../../src/content/Quicktasks.vue";
import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import { createTestingVuetify } from "../../unit/vuetify";

describe("Integrationtest for Quicktask", () => {
  let wrapper;
  let el = document.createElement("div");
  el.id = "app";
  document.body.appendChild(el);

  beforeEach(() => {
    const pinia = createTestingPinia({ stubActions: false });
    const vuetify = createTestingVuetify();
    setActivePinia(pinia);
    wrapper = mount(Quicktasks, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });

  it("renders component", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
