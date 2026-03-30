import { describe, it, expect } from "vitest";
import { extractText } from "./extractText";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Minimal valid Tiptap doc wrapper. */
function doc(...nodes: object[]) {
  return { type: "doc", content: nodes };
}

function paragraph(...texts: string[]) {
  return {
    type: "paragraph",
    content: texts.map((t) => ({ type: "text", text: t })),
  };
}

function heading(level: number, text: string) {
  return {
    type: "heading",
    attrs: { level },
    content: [{ type: "text", text }],
  };
}

function bulletList(...items: string[]) {
  return {
    type: "bulletList",
    content: items.map((text) => ({
      type: "listItem",
      content: [paragraph(text)],
    })),
  };
}

function codeBlock(code: string) {
  return {
    type: "codeBlock",
    content: [{ type: "text", text: code }],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("extractText", () => {
  // --- null / undefined / bad input ---

  it("returns empty string for null", () => {
    expect(extractText(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(extractText(undefined)).toBe("");
  });

  it("returns empty string for a non-object (string)", () => {
    expect(extractText("hello")).toBe("");
  });

  it("returns empty string for an array", () => {
    expect(extractText([])).toBe("");
  });

  it("returns empty string for an object with no content array", () => {
    expect(extractText({ type: "doc" })).toBe("");
  });

  // --- empty document ---

  it("returns empty string for an empty doc", () => {
    expect(extractText(doc())).toBe("");
  });

  it("returns empty string for a doc with an empty paragraph", () => {
    expect(extractText(doc({ type: "paragraph" }))).toBe("");
  });

  // --- simple text ---

  it("extracts text from a single paragraph", () => {
    expect(extractText(doc(paragraph("Hello, world!")))).toBe("Hello, world!");
  });

  it("extracts text from a paragraph with multiple text nodes (bold, plain)", () => {
    const node = {
      type: "paragraph",
      content: [
        { type: "text", text: "Hello " },
        { type: "text", text: "world", marks: [{ type: "bold" }] },
        { type: "text", text: "!" },
      ],
    };
    expect(extractText(doc(node))).toBe("Hello world!");
  });

  // --- headings ---

  it("extracts text from a heading", () => {
    expect(extractText(doc(heading(1, "My Note")))).toBe("My Note");
  });

  // --- multiple blocks ---

  it("concatenates heading and paragraph with newline separator", () => {
    const result = extractText(doc(heading(1, "Shopping list"), paragraph("Bananas")));
    expect(result).toBe("Shopping list\nBananas");
  });

  it("handles multiple paragraphs", () => {
    const result = extractText(
      doc(paragraph("First paragraph."), paragraph("Second paragraph."))
    );
    expect(result).toBe("First paragraph.\nSecond paragraph.");
  });

  // --- nested structures ---

  it("extracts text from a bulleted list", () => {
    const result = extractText(doc(bulletList("Milk", "Eggs", "Bananas")));
    expect(result).toContain("Milk");
    expect(result).toContain("Eggs");
    expect(result).toContain("Bananas");
  });

  it("extracts text from a code block", () => {
    expect(extractText(doc(codeBlock("const x = 1;")))).toBe("const x = 1;");
  });

  it("handles a full note: heading + paragraph + list", () => {
    const fullDoc = doc(
      heading(1, "Weekly review"),
      paragraph("Things that went well this week:"),
      bulletList("Shipped the auth phase", "All tests passing", "Zero regressions")
    );
    const result = extractText(fullDoc);
    expect(result).toContain("Weekly review");
    expect(result).toContain("Things that went well this week:");
    expect(result).toContain("Shipped the auth phase");
    expect(result).toContain("Zero regressions");
  });

  // --- trims whitespace ---

  it("trims leading and trailing whitespace from the result", () => {
    const result = extractText(doc(paragraph("  hello  ")));
    // Individual text node content is preserved; outer trim removes
    // any leading/trailing newlines from the assembly
    expect(result.startsWith("\n")).toBe(false);
    expect(result.endsWith("\n")).toBe(false);
  });
});
