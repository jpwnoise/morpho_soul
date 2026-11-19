
from lxml import etree

svg_file = r"Human-male-T-pose.svg"

tree = etree.parse(svg_file)
root = tree.getroot()

for element in root.iter():
    if etree.QName(element).localname == "path":
        print("\nPATH:", element.get("id"))
        print("d:", element.get("d", "")[:180])
        print("transform:", element.get("transform"))
        print("style:", element.get("style"))

