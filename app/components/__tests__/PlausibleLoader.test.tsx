"use strict";

import React from "react";
import { render, waitFor, cleanup } from "@testing-library/react";
import PlausibleLoader, { PlausibleLoaderContent } from "../PlausibleLoader";

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
  // Clean env vars and localStorage between tests
  delete process.env.NEXT_PUBLIC_PLAUSIBLE;
  delete process.env.NEXT_PUBLIC_PLAUSIBLE_DEFAULT_CONSENT;
  try { window.localStorage.removeItem("analytics_consent"); } catch {}
});

describe("PlausibleLoaderContent (pure checks)", () => {
  test("returns null when disabled", () => {
    const res = PlausibleLoaderContent(false, null, false);
    expect(res).toBeNull();
  });

  test("blocks when consent is explicitly false", () => {
    const res = PlausibleLoaderContent(true, false, true);
    expect(res).toBeNull();
  });

  test("requires defaultConsent when consent is null", () => {
    const res = PlausibleLoaderContent(true, null, false);
    expect(res).toBeNull();
    const res2 = PlausibleLoaderContent(true, null, true);
    // Expect a React fragment with two children (two Script elements)
    expect(res2).not.toBeNull();
    // The output should be a fragment with children length 2
    // @ts-expect-error - inspect internal props for the returned element
    const children = res2.props?.children || [];
    expect(React.Children.count(children)).toBe(2);
  });
});

describe("PlausibleLoader (integration with localStorage)", () => {
  test("when enabled and defaultConsent persists and dispatches event", async () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE = "1";
    process.env.NEXT_PUBLIC_PLAUSIBLE_DEFAULT_CONSENT = "1";

    // Ensure no consent stored initially
    window.localStorage.removeItem("analytics_consent");

    const dispatchSpy = jest.spyOn(window, "dispatchEvent");

    render(<PlausibleLoader />);

    await waitFor(() => expect(window.localStorage.getItem("analytics_consent")).toBe("1"));
    expect(dispatchSpy).toHaveBeenCalled();
  });

  test("when consent is explicitly denied, remains denied", async () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE = "1";
    process.env.NEXT_PUBLIC_PLAUSIBLE_DEFAULT_CONSENT = "1";

    window.localStorage.setItem("analytics_consent", "0");
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");

    render(<PlausibleLoader />);

    // Allow effect to run
    await waitFor(() => expect(window.localStorage.getItem("analytics_consent")).toBe("0"));
    // Should not re-dispatch when explicit deny is present
    expect(dispatchSpy).not.toHaveBeenCalledWith(new Event("analytics-consent-changed"));
  });
});
