"""Print the live <section id> list of a single-file deck, in DOM order.

Sections parked inside <template> blocks are skipped; everything else is a slide, including
data-navhide sub-slides (they still print).
"""
import re, sys

html = open(sys.argv[1], encoding="utf-8").read()
html = re.sub(r"<template\b.*?</template>", "", html, flags=re.S)
ids = re.findall(r'<section\s+id="([A-Za-z0-9_-]+)"', html)
print(" ".join(ids))
