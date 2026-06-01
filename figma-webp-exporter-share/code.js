figma.showUI(__html__, { width: 380, height: 460 });

function getExportableNodes() {
  const selected = figma.currentPage.selection;
  return selected.filter((node) => {
    return (
      node.type === "FRAME" ||
      node.type === "COMPONENT" ||
      node.type === "INSTANCE" ||
      node.type === "GROUP" ||
      node.type === "SECTION"
    );
  });
}

function sanitizeFileName(name) {
  return (name || "frame")
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
}

async function exportNodesAsPng(nodes) {
  const results = [];

  for (const node of nodes) {
    try {
      const pngBytes = await node.exportAsync({
        format: "PNG",
      });

      results.push({
        id: node.id,
        name: sanitizeFileName(node.name),
        width: Math.round(node.width),
        height: Math.round(node.height),
        bytes: pngBytes,
      });
    } catch (error) {
      results.push({
        id: node.id,
        name: sanitizeFileName(node.name),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

function notifySelectionState() {
  const nodes = getExportableNodes();
  figma.ui.postMessage({
    type: "selection-info",
    selectedCount: figma.currentPage.selection.length,
    exportableCount: nodes.length,
  });
}

figma.on("selectionchange", () => {
  notifySelectionState();
});

notifySelectionState();

figma.ui.onmessage = async (msg) => {
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "run-export") {
    const maxKb = Number(msg.maxKb);

    if (!Number.isFinite(maxKb) || maxKb <= 0) {
      figma.ui.postMessage({
        type: "export-error",
        message: "Введите корректный лимит в KB (больше 0).",
      });
      return;
    }

    const nodes = getExportableNodes();

    if (!nodes.length) {
      figma.ui.postMessage({
        type: "export-error",
        message: "Выделите хотя бы 1 фрейм/компонент/группу/секцию.",
      });
      return;
    }

    figma.ui.postMessage({ type: "export-started", total: nodes.length, maxKb });

    const exported = await exportNodesAsPng(nodes);

    figma.ui.postMessage({
      type: "export-png-ready",
      items: exported,
      maxKb,
    });
  }

  if (msg.type === "close") {
    figma.closePlugin();
  }
};
