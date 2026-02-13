import { cache } from "react";

export const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
export const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie" | "series" | "episode";
  Poster: string;
}

export interface MovieDetail extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface SearchResult {
  Search: Movie[];
  totalResults: string;
  Response: "True" | "False";
  Error?: string;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelName: string;
}

// Use React.cache for per-request deduplication (Vercel best practice)
export const searchMovies = cache(async (
  query: string, 
  type?: string, 
  year?: string,
  page = 1
): Promise<SearchResult> => {
  if (!OMDB_API_KEY) {
    console.warn("OMDB_API_KEY is missing. Using mock data.");
    return {
      Search: [
        { Title: `Mock ${query} 1`, Year: year || "2025", imdbID: "tt1", Type: "movie", Poster: "N/A" },
        { Title: `Mock ${query} 2`, Year: year || "2025", imdbID: "tt2", Type: "series", Poster: "N/A" },
        { Title: `Mock ${query} 3`, Year: "2024", imdbID: "tt3", Type: "movie", Poster: "N/A" },
        { Title: `Mock ${query} 4`, Year: "2024", imdbID: "tt4", Type: "series", Poster: "N/A" },
      ],
      totalResults: "4",
      Response: "True"
    };
  }

  const params = new URLSearchParams({
    apikey: OMDB_API_KEY,
    s: query,
    page: page.toString(),
  });
  
  if (type) params.append("type", type);
  if (year) params.append("y", year);
  
  const res = await fetch(
    `https://www.omdbapi.com/?${params.toString()}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error(`OMDB API error: ${res.status}`);
  }
  
  const data = await res.json();
  return data as SearchResult;
});

// Also cache movie detail requests
export const getMovieDetail = cache(async (imdbID: string): Promise<MovieDetail> => {
  if (!OMDB_API_KEY) {
    return {
      Title: "Mock Movie Detail",
      Year: "2025",
      imdbID: imdbID,
      Plot: "This is a mock plot for testing without API key.",
      Poster: "N/A",
      imdbRating: "8.5",
      Rated: "PG-13",
      Runtime: "120 min",
      Type: "movie",
      Language: "English",
      Country: "USA",
      Awards: "N/A",
      Ratings: [],
      Metascore: "N/A",
      imdbVotes: "N/A",
      DVD: "N/A",
      BoxOffice: "N/A",
      Production: "N/A",
      Website: "N/A",
      Response: "True",
      Released: "01 Jan 2025",
      Genre: "Drama",
      Director: "Mock Director",
      Writer: "Mock Writer",
      Actors: "Mock Actor"
    } as MovieDetail;
  }
  
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`,
    { next: { revalidate: 86400 } }
  );
  
  if (!res.ok) {
    throw new Error(`OMDB API error: ${res.status}`);
  }
  
  const data = await res.json();
  return data as MovieDetail;
});

// Get YouTube trailer - cached
export const getYouTubeTrailer = cache(async (title: string, year: string): Promise<YouTubeVideo | null> => {
  if (!YOUTUBE_API_KEY) {
    // Return null if no API key, trailer will be hidden
    return null;
  }
  
  try {
    // Search for official trailer
    const searchQuery = `${title} ${year} official trailer`;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(searchQuery)}&type=video&videoType=official&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 86400 } }
    );
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        channelName: video.snippet.channelTitle
      };
    }
    
    return null;
  } catch (error) {
    console.error("YouTube API error:", error);
    return null;
  }
});

// Get current year for dynamic content
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// Get trending search terms
export function getTrendingTerms(): string[] {
  return ["Marvel", "Star Wars", "Netflix", "HBO", "Disney"];
}

// Helper function to deduplicate movies by imdbID
function deduplicateMovies(movies: Movie[]): Movie[] {
  const seenIds = new Set<string>();
  const unique: Movie[] = [];
  
  for (const movie of movies) {
    if (!seenIds.has(movie.imdbID)) {
      seenIds.add(movie.imdbID);
      unique.push(movie);
    }
  }
  
  return unique;
}

// Get releases by year using OMDB parameter 'y'
export async function getReleasesByYear(year: number): Promise<Movie[]> {
  const currentYear = year || getCurrentYear();
  
  // Search multiple pages to get more results
  const [page1, page2, page3] = await Promise.all([
    searchMovies(currentYear.toString(), undefined, undefined, 1),
    searchMovies(currentYear.toString(), undefined, undefined, 2),
    searchMovies(currentYear.toString(), undefined, undefined, 3),
  ]);
  
  const allMovies = [
    ...(page1.Search || []), 
    ...(page2.Search || []), 
    ...(page3.Search || [])
  ];
  
  return deduplicateMovies(allMovies);
}
