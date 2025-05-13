import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import Note from "../../../src/components/Note.vue";

describe("NoteTests", () => {
  it("renders properly note to self ", () => {
    const wrapper = mount(Note, {
      props: {
        type: "self",
        content: [{ task: "Hello Vitest", status: false }],
      },
    });
    expect(wrapper.text()).toContain("Hello Vitest");
  });

  it("renders properly note to sender ", () => {
    const wrapper = mount(Note, {
      props: {
        type: "send",
        title: "stuff",
        content: [{ task: "Hello Vitest", status: false }],
        correspondent: "Account",
        author: "account",
      },
    });
    expect(wrapper.text()).toContain("Hello Vitest");
    expect(wrapper.text()).toContain("to");
  });
});
