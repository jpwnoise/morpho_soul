
import { DOMParser, type Element } from "@xmldom/xmldom";

import {
    SvgDocument,
    SvgElement,
    SvgGroup,
    SvgPath,
} from "./types";

function getAttributes(element: Element): Record<string, string> {
    const attributes: Record<string, string> = {};

    for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes.item(i);

        if (attribute) {
            attributes[attribute.name] = attribute.value;
        }
    }

    return attributes;
}

function parseElement(element: Element): SvgElement | null {
    const tag = element.localName;
    const id = element.getAttribute("id");

    if (tag !== "g" && tag !== "path") {
        return null;
    }

    if (!id) {
        throw new Error(`Elemento <${tag}> sin ID`);
    }

    const attributes = getAttributes(element);

    if (tag === "path") {
        const d = element.getAttribute("d");

        if (d === null) {
            throw new Error(`Path "${id}" sin geometría`);
        }

        const path: SvgPath = {
            type: "path",
            id,
            attributes,
            d,
        };

        return path;
    }

    const group: SvgGroup = {
        type: "group",
        id,
        attributes,
        children: [],
    };

    for (let i = 0; i < element.children.length; i++) {
        const child = parseElement(element.children.item(i)!);

        if (child) {
            group.children.push(child);
        }
    }

    return group;
}

export function readSvg(source: string): SvgDocument {
    const errors: string[] = [];

    const parser = new DOMParser({
        onError: (level, message) => {
            errors.push(`${level}: ${message}`);
        },
    });

    // Parse the SVG source string into a DOM document
    const xml = parser.parseFromString(source, "image/svg+xml");

    if (errors.length > 0) {
        throw new Error(`SVG inválido: ${errors.join("\n")}`);
    }

    // Get the root element of the document
    const root = xml.documentElement;

    // Check if the root element is present 
    if (!root) {
        throw new Error("El documento XML no tiene elemento raíz");   
    }


    // Check if the root element is an SVG element
    if (root.localName !== "svg") {
        throw new Error("El documento no tiene una raíz SVG válida");
    }

    const document: SvgDocument = {
        attributes: getAttributes(root),
        children: [],
    };

    for (let i = 0; i < root.children.length; i++) {
        const child = parseElement(root.children.item(i)!);

        if (child) {
            document.children.push(child);
        }
    }

    return document;
}
