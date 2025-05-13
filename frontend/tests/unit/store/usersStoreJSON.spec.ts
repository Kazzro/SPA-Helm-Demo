import { createPinia, setActivePinia } from "pinia";

import { useUserStore } from "../../../src/stores/usersStoreJSON";

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("userstore", () => {
  let userStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    userStore = useUserStore();
  });

  afterEach(() => {
    userStore.user = null;
    userStore.loadingUser = false;
    userStore.errorMessage = "";
  });

  it("doesn't explode", () => {
    expect(userStore.user).toBe(null);
  });

  it("should validate email and password", () => {
    expect(userStore.inputValid("", "password")).toBeFalsy();
    expect(userStore.inputValid("invalid_email", "password")).toBeFalsy();
    expect(userStore.inputValid("valid@email.com", "short")).toBeFalsy();
    expect(userStore.inputValid("valid@email.com", "")).toBeFalsy();
    expect(
      userStore.inputValid("valid@email.com", "valid_password")
    ).toBeTruthy();
  });

  it("should validate email, password, and username for signup", () => {
    expect(userStore.inputValidSignup("", "password")).toBeFalsy();
    expect(userStore.inputValidSignup("invalid_email", "password")).toBeFalsy();
    expect(userStore.inputValidSignup("valid@email.com", "short")).toBeFalsy();
    expect(
      userStore.inputValidSignup("valid@email.com", "", "username")
    ).toBeFalsy();
    expect(
      userStore.inputValidSignup("valid@email.com", "valid_password")
    ).toBeFalsy();
    expect(
      userStore.inputValidSignup("valid@email.com", "valid_password", "sh")
    ).toBeFalsy();
    expect(
      userStore.inputValidSignup(
        "valid@email.com",
        "valid_password",
        "username"
      )
    ).toBeTruthy();
  });

  it("should handle login", async () => {
    const credentials = {
      email: "valid@email.com",
      password: "valid_password",
    };

    vi.mock("../../../src/db.ts");

    const db = await import("../../../src/db");

    const response = { data: [credentials] };
    db.userdb.get = vi.fn().mockResolvedValue(response);

    it("should accept existing user", async () => {
      await userStore.handleLogin(credentials);
      expect(userStore.user.email).toEqual("valid@email.com");
      expect(userStore.errorMessage).toBe("");
      expect(userStore.user).toBeDefined();
    });

    it("should deny not existing user", async () => {
      await userStore.handleLogin({
        email: "invalid@email.com",
        password: "invalid_password",
      });
      expect(userStore.user).toBeNull();
      expect(userStore.errorMessage).toBe("user not found");
    });
  });

  it("should handle signup", async () => {
    const existing_credentials = {
      email: "existing@email.com",
      password: "existing_password",
      username: "existing_username",
    };

    const new_credentials = {
      email: "new@email.com",
      password: "new_password",
      username: "new_username",
    };

    const data = [existing_credentials];

    vi.mock("../../../src/db.ts");
    const db = await import("../../../src/db");
    const response = { data: data };
    db.userdb.get = vi.fn().mockResolvedValue(response);
    db.userIdentsdb.get = vi.fn().mockResolvedValue(response);
    const spy = vi.spyOn(db.userdb, "post");
    //db.userdb.post = vi.fn().mockResolvedValue(() => {});
    db.counterdb.get = vi.fn().mockResolvedValue({ data: { counter: 1 } });

    await userStore.handleSignup(existing_credentials);
    expect(userStore.errorMessage).toBe(
      "Email existing@email.com already registered"
    );
    expect(userStore.user).toBeNull();

    await userStore.handleSignup(new_credentials);
    expect(userStore.user != null).toBe(true);
  });

  it("should handle logout", async () => {
    const credentials = {
      email: "valid@email.com",
      password: "valid_password",
    };

    vi.mock("../../../src/db.ts");
    const db = await import("../../../src/db");
    const response = { data: [credentials] };
    db.userdb.get = vi.fn().mockResolvedValue(response);
    const counter = { data: [{ counter: 1 }] };
    db.counterdb.get = vi.fn().mockResolvedValue(counter);
    expect(userStore.user).toBe(null);

    await userStore.handleLogin(credentials);
    expect(userStore.user.email).toBe(credentials.email);

    userStore.handleLogout();

    expect(userStore.user).toBeNull();
  });
});
