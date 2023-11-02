#!/usr/bin/env python3

import zipfile
from io import BytesIO
from urllib.request import urlopen
from pathlib import Path
import json

result = {
    "version": 1.1,
    "tags": [],
    "globalAttributes": [],
    "valueSets": [
        {
            "name": "swap",
            "values": [
                {
                    "name": "innerHTML",
                    "description": "The default, puts the content inside the target element",
                },
                {
                    "name": "outerHTML",
                    "description": "Replaces the entire target element with the returned content",
                },
                {
                    "name": "afterbegin",
                    "description": "Prepends the content before the first child inside the target",
                },
                {
                    "name": "beforebegin",
                    "description": "Prepends the content before the target in the targets parent element",
                },
                {
                    "name": "beforeend",
                    "description": "Appends the content after the last child inside the target",
                },
                {
                    "name": "afterend",
                    "description": "Appends the content after the target in the targets parent element",
                },
                {
                    "name": "delete",
                    "description": "Deletes the target element regardless of the response",
                },
                {
                    "name": "none",
                    "description": "Does not append content from response (Out of Band Swaps and Response Headers will still be processed)",
                },
            ],
        }
    ],
}

documented_value_sets = {e["name"] for e in result["valueSets"]}

HTMX_VERSION = "1.9.6"

response = urlopen(
    f"https://github.com/bigskysoftware/htmx/archive/refs/tags/v{HTMX_VERSION}.zip"
)
assert response.code == 200
content = response.read()

zip_fd = zipfile.ZipFile(BytesIO(content))

for f in zip_fd.filelist:
    if (
        f.filename.endswith(".md")
        and "/www/content/attributes/" in f.filename
        and "_index" not in f.filename
    ):
        p = Path(f.filename)
        attribute = p.name.replace(".md", "")
        attribute_doc: str = zip_fd.read(f).decode()
        # Strip front matter from markdown
        attribute_doc = attribute_doc[attribute_doc.find("+++", 3)+3:].strip()

        entry = {
            "name": attribute,
            "description": attribute_doc,
            "references": [
                {
                    "name": "Official documention",
                    "url": f"https://htmx.org/attributes/{attribute}/",
                }
            ],
        }

        if attribute in documented_value_sets:
            entry |= {"valueSet": attribute}

        result["globalAttributes"].append(entry)

with open("html.htmx-data.json", "w") as output_file:
    json.dump(result, output_file, indent=2)
