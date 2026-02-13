/**
 * Attempts to get a higher resolution image URL from an OMDB/IMDB poster URL.
 * Removes the resizing parameters (e.g. _SX300) to get the original.
 */
export function getHighResPoster(url: string) {
    if (!url || url === "N/A") return "/placeholder.png";
    if (url.includes("amazon.com") || url.includes("imdb.com")) {
        // Remove the transformation parameters typically found at the end of the filename
        // e.g., ...@@._V1_SX300.jpg -> ...@@.jpg
        return url.replace(/_V1_.*\.jpg$/, "_V1_FMjpg_UX1000_.jpg");
        // Note: _V1_FMjpg_UX1000_.jpg is a common high-res pattern, or just removing it entirely.
        // Let's try removing it first, but sometimes that gives a huge image. 
        // Safer: replace _SX300 with _SX1000 or similar if it exists.
        // Regex to find _SX... or _SY... and remove it.
    }
    return url.replace(/_SX\d+/, "_SX1080").replace(/_SY\d+/, "_SY1080");
}
