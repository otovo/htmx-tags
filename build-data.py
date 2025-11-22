#!/usr/bin/env python3

import json
import logging
import zipfile
from http import HTTPStatus
from io import BytesIO
from pathlib import Path
from typing import Any
from urllib.request import urlopen

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

HTMX_VERSION = "2.0.8"
HTMX_RELEASE_URL = f"https://github.com/bigskysoftware/htmx/archive/refs/tags/v{HTMX_VERSION}.zip"


def get_base_result() -> dict[str, Any]:
    """Return a base result dictionary with the common structure for all HTMX attribute data."""
    return {
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
            },
        ],
    }


def fetch_zip_content(url: str) -> bytes:
    """Fetch the HTMX zip content from GitHub."""
    if not url.startswith("https://"):
        msg = f"Invalid URL scheme: {url}"
        raise ValueError(msg)

    logger.info(f"Downloading HTMX source from {url}")
    response = urlopen(url)  # noqa: S310
    if response.code != HTTPStatus.OK:
        msg = f"Failed to download HTMX source: {response.code}"
        raise RuntimeError(msg)
    return response.read()


def process_zip_content(content: bytes) -> dict[str, Any]:
    """Process the HTMX zip content to extract attribute data."""
    result = get_base_result()
    documented_value_sets = {e["name"] for e in result["valueSets"]}

    with zipfile.ZipFile(BytesIO(content)) as zip_fd:
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
                if "+++" in attribute_doc:
                    attribute_doc = attribute_doc[attribute_doc.find("+++", 3) + 3 :].strip()

                entry = {
                    "name": attribute,
                    "description": attribute_doc,
                    "references": [
                        {
                            "name": "Official documentation",
                            "url": f"https://htmx.org/attributes/{attribute}/",
                        },
                    ],
                }

                if attribute in documented_value_sets:
                    entry |= {"valueSet": attribute}

                result["globalAttributes"].append(entry)
    return result


def main() -> None:
    try:
        logger.info(f"Building data for HTMX version {HTMX_VERSION}")
        content = fetch_zip_content(HTMX_RELEASE_URL)
        data = process_zip_content(content)
        with Path("html.htmx-data.json").open("w", encoding="utf-8") as output_file:
            json.dump(data, output_file, indent=2, ensure_ascii=False)
        logger.info("Successfully generated html.htmx-data.json")
    except Exception:
        logger.exception("Error occurred during execution")


if __name__ == "__main__":
    main()
