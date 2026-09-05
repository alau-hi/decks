#!/bin/zsh
# Build a vector PDF from a single-file HTML deck.
#
#   tools/pdf/build-pdf.sh <deck-dir> [output-name]
#
# One page per live <section>, printed by Chrome at 15in x 8.4375in (= 1440x810 CSS px, so the
# print layout is the screen fit), real text, embedded fonts. Then Notes and References pages
# built from the deck's hover tips and source panels, then image recompression. Output lands in
# <deck>/exports/<output-name>.pdf; working files in <deck>/exports/.pdf-work/.
#
# The deck must follow the decks-repo conventions: sections are slides; fitSlides() zooms each
# section's .wrap and writes --z; the page reacts to html.exporting (see SKILL.md for the hooks).
set -e
DECK=${1:?usage: build-pdf.sh <deck-dir> [output-name]}; DECK=${DECK:A}
NAME=${2:-$(basename $DECK)}
HERE=${0:A:h}
WORK=$DECK/exports/.pdf-work
VENV=$HERE/.venv
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -f $DECK/slides.html ] || { echo "no slides.html in $DECK" >&2; exit 1; }
[ -x $VENV/bin/python ] || { python3 -m venv $VENV && $VENV/bin/pip -q install pypdf pillow; }
rm -rf $WORK; mkdir -p $WORK/vec $DECK/exports

IDS=($($VENV/bin/python $HERE/sections.py $DECK/slides.html))
echo "${#IDS} slides: $IDS"

# One section visible, export mode on, the deck's own @media print block overridden so the page
# keeps the fit zoom, the footer chrome and one page per section. Images in the visible section
# load eagerly and the fit re-runs once they have, so their heights are real when Chrome prints.
prep(){
  cp $DECK/slides.html $DECK/_pv.html
  cat >> $DECK/_pv.html <<EOT
<style>
section:not(#$1){display:none!important}
.rv{opacity:1!important;transform:none!important;visibility:visible!important}
.gicons .fx,#jf .nowring{animation:none!important}
nav.dots,.scrollcue{display:none!important}
@page{size:15in 8.4375in;margin:0}
@media print{
  html.exporting .pageno,html.exporting .conf,html.exporting .brand{display:block!important}
  html.exporting,html.exporting body,html.exporting #deck{height:8.4375in!important;overflow:hidden!important}
  html.exporting section{min-height:8.4375in!important;height:8.4375in!important;overflow:hidden!important;break-after:auto!important;page-break-after:auto!important}
  html.exporting section>.wrap{zoom:var(--z,1)!important}
}
</style>
<script>document.documentElement.classList.add('exporting');if('$1'!=='${IDS[1]}')document.body.classList.remove('on-cover');
document.querySelectorAll('#$1 img[loading=lazy]').forEach(i=>{i.loading='eager';});
addEventListener('load',()=>{Promise.all([...document.querySelectorAll('#$1 img')].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r;}))).then(()=>setTimeout(()=>{if(typeof fitSlides==='function')fitSlides();},900));});</script>
EOT
}
print(){ "$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,897 --virtual-time-budget=8000 --no-pdf-header-footer --print-to-pdf=$2 "file://$DECK/_pv.html#$1" >/dev/null 2>&1; }

# warm-up: the first Chrome launch of a batch can print before the web fonts land
prep ${IDS[1]}; print ${IDS[1]} $WORK/vec/_warm.pdf; rm -f $WORK/vec/_warm.pdf
n=0
for id in $IDS; do
  n=$((n+1)); f=$(printf '%02d-%s' $n $id); prep $id; print $id $WORK/vec/$f.pdf
  printf '.'
done; echo
rm -f $DECK/_pv.html

$VENV/bin/python $HERE/extract_notes.py $DECK $WORK
$VENV/bin/python $HERE/assemble.py $DECK $WORK "$DECK/exports/$NAME.pdf" ${#IDS}
