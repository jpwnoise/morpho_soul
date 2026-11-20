import type {
  SvgDocument,
  SvgElement,
  SvgGroup,
  SvgPath,
} from "@/src/lib/svg/types";

import { useState } from "react";

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function HoverBounds({ bounds }: { bounds: BoundingBox | null }) {
  if (!bounds) return null;

  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      fill="none"
      stroke="#00a8ff"
      strokeWidth={1}
      strokeDasharray="5 3"
      vectorEffect="non-scaling-stroke"
      pointerEvents="none"
    />
  );
}

interface AnatomyRendererProps {
  document: SvgDocument;
  className?: string;
}

// Convierte "fill:#000;stroke:none" en un objeto React
function parseStyle(style: string): React.CSSProperties {
  const result: Record<string, string> = {};

  style.split(";").forEach((declaration) => {
    const [property, ...values] = declaration.split(":");

    if (property && values.length > 0) {
      const key = property.trim().replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );

      result[key] = values.join(":").trim();
    }
  });

  return result as React.CSSProperties;
}

// Convierte los atributos SVG a propiedades compatibles con React

function getReactAttributes(attributes: Record<string, string>) {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(attributes)) {
    let reactKey = key;

    // Convertir nombres de atributos XML a JSX
    if (key === "xml:space") {
      reactKey = "xmlSpace";
    }

    if (key === "xlink:href") {
      reactKey = "xlinkHref";
    }

    if (key === "class") {
      reactKey = "className";
    }

    // Convertir estilos CSS
    if (key === "style") {
      result.style = parseStyle(value);
      continue;
    }

    result[reactKey] = value;
  }

  return result;
}


function renderElement(
  element: SvgElement,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void
) {
  switch (element.type) {
    case "group":
      return renderGroup(element, selectedId, setSelectedId);

    case "path":
      return renderPath(element, selectedId, setSelectedId);

    default:
      return null;
  }
}

function renderGroup(
  group: SvgGroup,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void
) {
  return (
    <GroupElement
      key={group.id}
      group={group}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
    />
  );
}

function GroupElement({
  group,
  selectedId,
  setSelectedId,
}: {
  group: SvgGroup;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const attributes = getReactAttributes(group.attributes);
  const { id, ...rest } = attributes;

  const [bounds, setBounds] = useState<BoundingBox | null>(null);

  function handleMouseEnter(event: React.MouseEvent<SVGGElement>) {
    const box = event.currentTarget.getBBox();

    setBounds({
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    });

    setSelectedId(group.id);
  }

  return (
    <g
      id={id as string}
      {...rest}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setBounds(null)}
    >
      {group.children.map((child) =>
        renderElement(child, selectedId, setSelectedId)
      )}

      {selectedId === group.id && (
        <HoverBounds bounds={bounds} />
      )}
    </g>
  );
}

function renderPath(
  path: SvgPath,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void
) {
  return (
    <PathElement
      key={path.id}
      path={path}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
    />
  );
}

function PathElement({
  path,
  selectedId,
  setSelectedId,
}: {
  path: SvgPath;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const attributes = getReactAttributes(path.attributes);
  const { id, d, ...rest } = attributes;

  const [bounds, setBounds] = useState<BoundingBox | null>(null);

  function handleMouseEnter(event: React.MouseEvent<SVGPathElement>) {
    const box = event.currentTarget.getBBox();

    setBounds({
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    });

    setSelectedId(path.id);
  }

  return (
    <>
      <path
        id={id as string}
        d={d as string}
        {...rest}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setBounds(null)}
      />

      {selectedId === path.id && (
        <HoverBounds bounds={bounds} />
      )}
    </>
  );
}

export default function AnatomyRenderer({
  document,
  className,
}: AnatomyRendererProps) {
  const attributes = getReactAttributes(document.attributes);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <svg
      {...attributes}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {document.children.map((element) => renderElement(element, selectedId, setSelectedId))}
    </svg>
  );
}