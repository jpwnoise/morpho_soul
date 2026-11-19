
from lxml import etree

svg_file = r"Human-male-T-pose.svg"

tree = etree.parse(svg_file)
root = tree.getroot()

def inspect(element, depth=0):
    tag = etree.QName(element).localname
    element_id = element.get("id", "")
    label = element.get("{http://www.inkscape.org/namespaces/inkscape}label", "")
    
    if tag in ("g", "path", "rect", "circle", "ellipse", "polygon", "polyline"):
        print(
            "  " * depth
            + f"<{tag}> id='{element_id}' label='{label}'"
        )

    for child in element:
        inspect(child, depth + 1)

inspect(root)

