// Deck registry — the one place deck identity is defined. Dependency-free on
// purpose: the Edge middleware imports it as well as the Node APIs.
export const DECKS = {
  superwood:  { label: 'SUPERWOOD',          prefix: '/intro',                       home: '/intro' },
  supermills: { label: 'SUPERMILLS America', prefix: '/supermills-america-overview', home: '/supermills-america-overview/', password: 'SUPERMILLS_PASSWORD' },
};

// The deployment's own deck; rows with no better attribution belong to it.
export const DEFAULT_DECK = process.env.DECK_ID || 'superwood';

// Longest matching non-default prefix wins; anything else is the default deck.
export function deckFromPath(path) {
  const p = String(path || '');
  let best = null;
  for (const [id, d] of Object.entries(DECKS)) {
    if (id === DEFAULT_DECK) continue;
    const hit = p === d.prefix || p.startsWith(d.prefix + '/');
    if (hit && (!best || d.prefix.length > DECKS[best].prefix.length)) best = id;
  }
  return best || DEFAULT_DECK;
}
