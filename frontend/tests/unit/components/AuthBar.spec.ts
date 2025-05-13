import AuthBar from "../../../src/components/AuthBar.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { VueWrapper, shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import router from "../../../src/router/index";

describe("AuthBar", () => {
  let wrapper: VueWrapper;

  const createUnloggedAuthbar = () => {
    wrapper = shallowMount(AuthBar, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: { user: null },
              notes: { notes: [] },
            },
          }),
          router,
        ],
      },
    });
  };

  const createLoggedAuthbar = () => {
    wrapper = shallowMount(AuthBar, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                user: {
                  email: "test@ema.il",
                  password: "password",
                  username: "testuser",
                },
              },
              notes: { notes: [] },
            },
          }),

          router,
        ],
      },
    });
  };

  beforeEach(() => {
    //setActivePinia(createPinia());
  });

  it("renders properly", () => {
    createUnloggedAuthbar();
    expect(wrapper.exists()).toBe(true);
  });

  it("show signup/login button and dont show options/logout when not logged in", () => {
    createUnloggedAuthbar();
    expect(wrapper.findComponent('[data-test="SignUp"]').exists()).toBe(true);
    expect(wrapper.findComponent('[data-test="Options"]').exists()).toBe(false);
    expect(wrapper.findComponent('[data-test="Login"]').exists()).toBe(true);
    expect(wrapper.findComponent('[data-test="Logout"]').exists()).toBe(false);
  });

  it("show options/logout button and dont show signup/login when logged in", () => {
    createLoggedAuthbar();
    expect(wrapper.findComponent('[data-test="SignUp"]').exists()).toBe(false);
    expect(wrapper.findComponent('[data-test="Options"]').exists()).toBe(true);
    expect(wrapper.findComponent('[data-test="Login"]').exists()).toBe(false);
    expect(wrapper.findComponent('[data-test="Logout"]').exists()).toBe(true);
  });

  it("shows 'unsigned' when not logged in", () => {
    createUnloggedAuthbar();
    expect(wrapper.find('[data-test="userHeadline"]').text()).toBe("unsigned");
  });

  it("shows username 'testuser' when logged in", () => {
    createLoggedAuthbar();
    expect(wrapper.find('[data-test="userHeadline"]').text()).toBe("testuser");
  });

  it("shows logo either way", () => {
    createUnloggedAuthbar();
    expect(wrapper.find('[data-test="logo"]').exists()).toBe(true);
    wrapper.unmount();
    createLoggedAuthbar();
    expect(wrapper.find('[data-test="logo"]').exists()).toBe(true);
  });
});
