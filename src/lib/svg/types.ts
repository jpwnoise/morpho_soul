
export interface SvgGroup {
  type: "group";
  id: string;
  attributes: Record<string, string>;
  children: SvgElement[];
}

export interface SvgPath {
  type: "path";
  id: string;
  attributes: Record<string, string>;
  d: string;
}

export type SvgElement = SvgGroup | SvgPath;

export interface SvgDocument {
  attributes: Record<string, string>;
  children: SvgElement[];
}
