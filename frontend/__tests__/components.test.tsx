/// <reference types="vitest/globals" />
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CopyButton from "@/components/CopyButton";
import ReferrerBreakdown from "@/components/ReferrerBreakdown";

describe("CopyButton", () => {
  it("renders copy label", () => {
    render(<CopyButton text="https://example.com/abc" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });
});

describe("ReferrerBreakdown", () => {
  it("shows empty state", () => {
    render(<ReferrerBreakdown referrers={[]} />);
    expect(screen.getByText(/no referrer data/i)).toBeInTheDocument();
  });

  it("renders referrer rows", () => {
    render(
      <ReferrerBreakdown
        referrers={[
          { referrer: "twitter.com", count: 12 },
          { referrer: "google.com", count: 5 },
        ]}
      />,
    );
    expect(screen.getByText("twitter.com")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
