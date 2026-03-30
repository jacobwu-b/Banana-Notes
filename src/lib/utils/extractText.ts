/**
 * Extracts plaintext from a Tiptap/ProseMirror JSON document.
 *
 * Walk every node recursively. Text nodes contribute their `text` value.
 * Block-level nodes (paragraph, heading, blockquote, listItem, etc.) are
 * separated by a newline so search snippets stay readable.
 *
 * This output is stored in `notes.body_text` for full-text search.
 */

type ProseMirrorNode = {
  type: string;
  text?: string;
  content?: ProseMirrorNode[];
};

const BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "blockquote",
  "codeBlock",
  "bulletList",
  "orderedList",
  "listItem",
  "taskList",
  "taskItem",
  "horizontalRule",
  "table",
  "tableRow",
  "tableCell",
  "tableHeader",
]);

function walkNode(node: ProseMirrorNode, parts: string[]): void {
  if (node.type === "text" && typeof node.text === "string") {
    parts.push(node.text);
    return;
  }

  const isBlock = BLOCK_TYPES.has(node.type);

  if (node.content && node.content.length > 0) {
    if (isBlock && parts.length > 0 && parts[parts.length - 1] !== "\n") {
      parts.push("\n");
    }
    for (const child of node.content) {
      walkNode(child, parts);
    }
  }
}

export function extractText(doc: unknown): string {
  if (doc === null || doc === undefined) return "";

  // Gracefully handle non-object input
  if (typeof doc !== "object" || Array.isArray(doc)) return "";

  const root = doc as ProseMirrorNode;

  // Must be a doc node with content to be a valid ProseMirror document
  if (!root.content || !Array.isArray(root.content)) return "";

  const parts: string[] = [];
  for (const node of root.content) {
    walkNode(node, parts);
  }

  return parts.join("").trim();
}
