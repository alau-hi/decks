# Append ?v=<content hash> to every assets/ image reference in slides.html and v2.html so the CDN's day-long
# asset cache never serves a stale tile after an image is replaced under the same filename. Run after changing images.
import re, hashlib, os
def ver(path): return hashlib.md5(open(path,"rb").read()).hexdigest()[:8]
for p in ("slides.html","v2.html"):
    h=open(p).read()
    h=re.sub(r'assets/([\w.\-]+\.(?:jpg|jpeg|png|webp|svg))(\?v=[0-9a-f]{8})?',lambda m: f"assets/{m.group(1)}?v={ver('assets/'+m.group(1))}" if os.path.exists("assets/"+m.group(1)) else m.group(0),h)
    open(p,"w").write(h); print(p,"ok")
