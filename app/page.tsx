"use client";

import {
  useState,
  useEffect,
  useRef,
  SetStateAction,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import Image from "next/image";
import { SketchPicker, ColorResult } from "react-color";
import Navbar from "../components/Layout/Navbar";

const componentTypes = {
  HEADING: "heading",
  PARAGRAPH: "paragraph",
  IMAGE: "image",
  BUTTON: "button",
  CONTAINER: "container",
  LINK: "link",
};

type ComponentType = (typeof componentTypes)[keyof typeof componentTypes];

interface Component {
  id: string;
  type: ComponentType;
  content: string;
  style: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    fontFamily?: string;
    textAlign?: string;
    lineHeight?: string;
    backgroundColor?: string;
    padding?: string;
    border?: string;
    borderRadius?: string;
    cursor?: string;
    textDecoration?: string;
    width?: string;
    height?: string;
    display?: string;
    flexDirection?: string;
  };
  position: {
    x: number;
    y: number;
  };
  href: string;
}

const fontOptions = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Roboto",
  "Open Sans",
];

const defaultStyles = {
  [componentTypes.HEADING]: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Arial",
    textAlign: "left",
  },
  [componentTypes.PARAGRAPH]: {
    fontSize: "16px",
    color: "#555555",
    fontFamily: "Arial",
    textAlign: "left",
    lineHeight: "1.5",
  },
  [componentTypes.BUTTON]: {
    fontSize: "16px",
    color: "#ffffff",
    backgroundColor: "#3b82f6",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  [componentTypes.LINK]: {
    fontSize: "16px",
    color: "#3b82f6",
    textDecoration: "underline",
    cursor: "pointer",
  },
  [componentTypes.CONTAINER]: {
    width: "300px",
    height: "200px",
    backgroundColor: "#f9f9f9",
    border: "1px dashed #cccccc",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
  },
};

export default function Home() {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasBackground, setCanvasBackground] = useState("#ffffff");
  const [siteSettings, setSiteSettings] = useState({
    title: "My Website",
    description: "A website built with the website builder",
    author: "",
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const saveToHistory = (newComponents: Component[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newComponents));

    if (newHistory.length > 50) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const addComponent = (type: ComponentType) => {
    const newComponent: Component = {
      id: `component-${Date.now()}`,
      type,
      content:
        type === componentTypes.HEADING
          ? "Heading"
          : type === componentTypes.PARAGRAPH
          ? "Paragraph text"
          : type === componentTypes.BUTTON
          ? "Button"
          : type === componentTypes.LINK
          ? "Link"
          : "",
      style: { ...defaultStyles[type] },
      position: { x: 100, y: 100 },
      href: type === componentTypes.LINK ? "https://example.com" : "",
    };

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedComponent(newComponent.id);
    saveToHistory(newComponents);
  };

  const updateComponentProperty = (key: string, value: string) => {
    if (!selectedComponent) return;

    const newComponents = components.map((comp) =>
      comp.id === selectedComponent ? { ...comp, [key]: value } : comp
    );

    setComponents(newComponents);
    saveToHistory(newComponents);
  };

  const updateComponentStyle = (styleKey: string, value: string) => {
    if (!selectedComponent) return;

    const newComponents = components.map((comp) =>
      comp.id === selectedComponent
        ? {
            ...comp,
            style: {
              ...comp.style,
              [styleKey]: value,
            },
          }
        : comp
    );

    setComponents(newComponents);
    saveToHistory(newComponents);
  };

  const deleteComponent = (id: string) => {
    const newComponents = components.filter((comp) => comp.id !== id);
    setComponents(newComponents);
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
    saveToHistory(newComponents);
  };

  const duplicateComponent = (id: string) => {
    const component = components.find((c) => c.id === id);
    if (!component) return;

    const newComponent = {
      ...component,
      id: `component-${Date.now()}`,
      position: {
        x: component.position.x + 20,
        y: component.position.y + 20,
      },
    };

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedComponent(newComponent.id);
    saveToHistory(newComponents);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents(JSON.parse(history[newIndex]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents(JSON.parse(history[newIndex]));
    }
  };

  const exportWebsite = () => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${siteSettings.description}">
  <meta name="author" content="${siteSettings.author}">
  <title>${siteSettings.title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: ${canvasBackground};
    }
    .container {
      position: relative;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div class="container">`;

    components.forEach((comp) => {
      const styleString = Object.entries(comp.style || {})
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ");

      const positionStyle = `position: absolute; left: ${comp.position.x}px; top: ${comp.position.y}px;`;
      const fullStyle = `style="${positionStyle} ${styleString}"`;

      if (comp.type === componentTypes.HEADING) {
        html += `<h1 ${fullStyle}>${comp.content}</h1>`;
      } else if (comp.type === componentTypes.PARAGRAPH) {
        html += `<p ${fullStyle}>${comp.content}</p>`;
      } else if (comp.type === componentTypes.BUTTON) {
        html += `<button ${fullStyle}>${comp.content}</button>`;
      } else if (comp.type === componentTypes.LINK) {
        html += `<a href="${comp.href}" ${fullStyle}>${comp.content}</a>`;
      } else if (comp.type === componentTypes.IMAGE) {
        html += `<img src="${
          comp.content || "/placeholder.jpg"
        }" alt="Image" ${fullStyle} />`;
      } else if (comp.type === componentTypes.CONTAINER) {
        html += `<div ${fullStyle}>${comp.content}</div>`;
      }
    });

    html += `
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
  };

  const handleMouseDown = (
    e: MouseEvent<HTMLDivElement>,
    componentId: string
  ) => {
    if (editingComponent) return;

    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    setDragging(componentId);

    const componentRect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - componentRect.left,
      y: e.clientY - componentRect.top,
    });

    e.preventDefault();

    setSelectedComponent(componentId);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - dragOffset.x;
      const y = e.clientY - canvasRect.top - dragOffset.y;

      setComponents(
        components.map((comp) =>
          comp.id === dragging ? { ...comp, position: { x, y } } : comp
        )
      );
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(null);
      saveToHistory(components);
    }
  };

  const handleDoubleClick = (
    e: MouseEvent<HTMLDivElement>,
    componentId: string
  ) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    if (
      component.type === componentTypes.HEADING ||
      component.type === componentTypes.PARAGRAPH ||
      component.type === componentTypes.BUTTON ||
      component.type === componentTypes.LINK
    ) {
      setEditingComponent(componentId);
      e.stopPropagation();
    }
  };

  const handleContentEdit = (
    e: React.FormEvent<HTMLElement>,
    componentId: string
  ) => {
    const value = (e.target as HTMLElement).innerText;
    setComponents(
      components.map((comp) =>
        comp.id === componentId ? { ...comp, content: value } : comp
      )
    );
  };

  const handleBlur = () => {
    setEditingComponent(null);
    saveToHistory(components);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) =>
      handleMouseMove(e as unknown as MouseEvent);
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset, components]);

  useEffect(() => {
    if (history.length === 0) {
      setHistory(["[]"]);
      setHistoryIndex(0);
    }
  }, [history.length]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }

      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
      }

      if (e.key === "Delete" && selectedComponent) {
        e.preventDefault();
        deleteComponent(selectedComponent);
      }

      if (e.ctrlKey && e.key === "d" && selectedComponent) {
        e.preventDefault();
        duplicateComponent(selectedComponent);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedComponent, historyIndex]);

  const selectedComp = selectedComponent
    ? components.find((c) => c.id === selectedComponent)
    : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Navbar
        undo={undo}
        redo={redo}
        exportWebsite={exportWebsite}
        historyIndex={historyIndex}
        historyLength={history.length}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Components
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addComponent(componentTypes.HEADING)}
                className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                Heading
              </button>
              <button
                onClick={() => addComponent(componentTypes.PARAGRAPH)}
                className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                Paragraph
              </button>
              <button
                onClick={() => addComponent(componentTypes.IMAGE)}
                className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                Image
              </button>
              <button
                onClick={() => addComponent(componentTypes.BUTTON)}
                className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                Button
              </button>
              <button
                onClick={() => addComponent(componentTypes.LINK)}
                className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                Link
              </button>
              <button
                onClick={() => addComponent(componentTypes.CONTAINER)}
                className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                Container
              </button>
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Site Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={siteSettings.title}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={siteSettings.description}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={siteSettings.author}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canvas Background
                </label>
                <div className="relative">
                  <div
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    style={{ backgroundColor: canvasBackground }}
                    onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                  />
                  {showBgColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <div
                        className="fixed inset-0"
                        onClick={() => setShowBgColorPicker(false)}
                      />
                      <SketchPicker
                        color={canvasBackground}
                        onChange={(color) => setCanvasBackground(color.hex)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex-1 relative overflow-auto"
          ref={canvasRef}
          style={{ backgroundColor: canvasBackground }}
        >
          {components.map((component) => (
            <div
              key={component.id}
              className={`absolute p-2 ${
                selectedComponent === component.id
                  ? "outline-2 outline-blue-500 shadow-lg"
                  : "outline-1 outline-transparent"
              } ${dragging === component.id ? "opacity-80 shadow-xl" : ""}`}
              onClick={() => setSelectedComponent(component.id)}
              onMouseDown={(e) => handleMouseDown(e, component.id)}
              onDoubleClick={(e) => handleDoubleClick(e, component.id)}
              style={{
                left: `${component.position.x}px`,
                top: `${component.position.y}px`,
                cursor: dragging === component.id ? "grabbing" : "grab",
                ...(component.style as any),
              }}
            >
              {component.type === componentTypes.HEADING &&
                (editingComponent === component.id ? (
                  <h1
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    onInput={(e) => handleContentEdit(e, component.id)}
                    autoFocus
                    className="outline-none"
                  >
                    {component.content}
                  </h1>
                ) : (
                  <h1>{component.content}</h1>
                ))}

              {component.type === componentTypes.PARAGRAPH &&
                (editingComponent === component.id ? (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    onInput={(e) => handleContentEdit(e, component.id)}
                    autoFocus
                    className="outline-none"
                  >
                    {component.content}
                  </p>
                ) : (
                  <p>{component.content}</p>
                ))}

              {component.type === componentTypes.BUTTON &&
                (editingComponent === component.id ? (
                  <button
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    onInput={(e) => handleContentEdit(e, component.id)}
                    autoFocus
                    className="outline-none"
                  >
                    {component.content}
                  </button>
                ) : (
                  <button>{component.content}</button>
                ))}

              {component.type === componentTypes.LINK &&
                (editingComponent === component.id ? (
                  <a
                    href="#"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    onInput={(e) => handleContentEdit(e, component.id)}
                    autoFocus
                    className="outline-none"
                  >
                    {component.content}
                  </a>
                ) : (
                  <a href={component.href}>{component.content}</a>
                ))}

              {component.type === componentTypes.IMAGE && (
                <Image
                  src={component.content || "/placeholder.jpg"}
                  alt="Image"
                  width={200}
                  height={150}
                />
              )}

              {component.type === componentTypes.CONTAINER && (
                <div className="flex items-center justify-center w-full h-full opacity-70">
                  {component.content && <span>{component.content}</span>}
                  {!component.content && (
                    <span className="text-gray-400">Container</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Properties
            </h2>

            {selectedComponent && selectedComp ? (
              <div className="space-y-5">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Content
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Content Text
                      </label>
                      <input
                        type="text"
                        value={selectedComp.content || ""}
                        onChange={(e) =>
                          updateComponentProperty("content", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {selectedComp.type === componentTypes.LINK && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          URL
                        </label>
                        <input
                          type="text"
                          value={selectedComp.href || ""}
                          onChange={(e) =>
                            updateComponentProperty("href", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    {selectedComp.type === componentTypes.IMAGE && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={selectedComp.content || ""}
                          onChange={(e) =>
                            updateComponentProperty("content", e.target.value)
                          }
                          placeholder="Enter image URL"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Styling
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Font Family
                      </label>
                      <select
                        value={selectedComp.style?.fontFamily || "Arial"}
                        onChange={(e) =>
                          updateComponentStyle("fontFamily", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {fontOptions.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Font Size
                      </label>
                      <input
                        type="text"
                        value={selectedComp.style?.fontSize || ""}
                        onChange={(e) =>
                          updateComponentStyle("fontSize", e.target.value)
                        }
                        placeholder="e.g. 16px"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Text Color
                      </label>
                      <div className="relative">
                        <div
                          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                          style={{
                            backgroundColor:
                              selectedComp.style?.color || "#000000",
                          }}
                          onClick={() => setShowColorPicker(!showColorPicker)}
                        />
                        {showColorPicker && (
                          <div className="absolute z-10 mt-2">
                            <div
                              className="fixed inset-0"
                              onClick={() => setShowColorPicker(false)}
                            />
                            <SketchPicker
                              color={selectedComp.style?.color || "#000000"}
                              onChange={(color: ColorResult) =>
                                updateComponentStyle("color", color.hex)
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {(selectedComp.type === componentTypes.BUTTON ||
                      selectedComp.type === componentTypes.CONTAINER) && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Background Color
                        </label>
                        <div className="relative">
                          <div
                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                            style={{
                              backgroundColor:
                                selectedComp.style?.backgroundColor ||
                                "#ffffff",
                            }}
                            onClick={() =>
                              setShowBgColorPicker(!showBgColorPicker)
                            }
                          />
                          {showBgColorPicker && (
                            <div className="absolute z-10 mt-2">
                              <div
                                className="fixed inset-0"
                                onClick={() => setShowBgColorPicker(false)}
                              />
                              <SketchPicker
                                color={
                                  selectedComp.style?.backgroundColor ||
                                  "#ffffff"
                                }
                                onChange={(color: ColorResult) =>
                                  updateComponentStyle(
                                    "backgroundColor",
                                    color.hex
                                  )
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Text Align
                      </label>
                      <select
                        value={selectedComp.style?.textAlign || "left"}
                        onChange={(e) =>
                          updateComponentStyle("textAlign", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="justify">Justify</option>
                      </select>
                    </div>

                    {selectedComp.type === componentTypes.CONTAINER && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Width
                          </label>
                          <input
                            type="text"
                            value={selectedComp.style?.width || ""}
                            onChange={(e) =>
                              updateComponentStyle("width", e.target.value)
                            }
                            placeholder="e.g. 300px"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Height
                          </label>
                          <input
                            type="text"
                            value={selectedComp.style?.height || ""}
                            onChange={(e) =>
                              updateComponentStyle("height", e.target.value)
                            }
                            placeholder="e.g. 200px"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateComponent(selectedComponent)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
                    title="Ctrl+D"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => deleteComponent(selectedComponent)}
                    className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm font-medium transition-colors"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-8">
                Select a component to edit its properties
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
