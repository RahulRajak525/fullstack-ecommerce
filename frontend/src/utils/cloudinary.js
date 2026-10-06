// Editorial photos (hero, categories, about) live in Cloudinary as 4000px+
// originals of 1-3 MB. Every request asks for a crop to the frame's aspect
// ratio (g_auto keeps the people/subject in frame), a modern format and a
// width, so srcSet widths are exact and no frame downloads more than it shows.
const BASE = "https://res.cloudinary.com/diiymyvcp/image/upload";

/** One transformed URL. `path` is the part after /upload/, e.g. "v123/name.jpg". */
export function photoUrl(path, width, ratio = "4:5") {
  return `${BASE}/f_auto,q_auto,c_fill,ar_${ratio},g_auto,w_${width}/${path}`;
}

/** A srcSet string covering the given widths. */
export function photoSrcSet(path, widths, ratio = "4:5") {
  return widths.map((w) => `${photoUrl(path, w, ratio)} ${w}w`).join(", ");
}
