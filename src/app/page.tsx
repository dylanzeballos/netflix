import { HeroSlider } from "@/components/HeroSlider";
import { MovieGrid } from "@/components/MovieGrid";
import { 
  searchMovies, 
  getMovieDetail, 
  MovieDetail, 
  getCurrentYear,
  getReleasesByYear,
  Movie 
} from "@/lib/omdb";
import { Suspense } from "react";

// Revalidate page every hour to get fresh content
export const revalidate = 3600;

// Generate static params for common views
export async function generateStaticParams() {
  return [
    {},
    { type: "series" },
    { type: "movie" },
    { sort: "popular" },
  ];
}

// Helper function to deduplicate movies
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

// Get featured movies for slider
async function getFeaturedMovies() {
  const ids = ["tt0816692", "tt1375666", "tt0468569", "tt0133093"];
  const movies = await Promise.all(ids.map(id => getMovieDetail(id)));
  return movies.filter(m => m && m.Response !== "False");
}

// Get trending content in parallel
async function getTrendingContent() {
  const [marvel, netflix, popular] = await Promise.all([
    searchMovies("Marvel"),
    searchMovies("Netflix"),
    searchMovies("Star Wars")
  ]);
  
  return {
    marvel: deduplicateMovies(marvel.Search || []),
    netflix: deduplicateMovies(netflix.Search || []),
    popular: deduplicateMovies(popular.Search || [])
  };
}

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : null;
  const type = typeof params.type === "string" ? params.type : null;
  const sort = typeof params.sort === "string" ? params.sort : null;
  
  const currentYear = getCurrentYear();
  const previousYear = currentYear - 1;

  let content;

  if (query) {
    // Search Mode - deduplicate results
    const data = await searchMovies(query);
    const results = deduplicateMovies(data.Search || []);
    content = (
      <div className="pt-24 md:pt-28 min-h-screen">
        <MovieGrid title={`Results for "${query}"`} movies={results} />
      </div>
    );
  } else if (type === "series") {
    // TV Shows Mode - deduplicate each section
    const [popSeries, newSeries, hboSeries] = await Promise.all([
      searchMovies("series", "series"),
      searchMovies(currentYear.toString(), "series"),
      searchMovies("HBO", "series")
    ]);

    content = (
      <div className="pt-24 md:pt-28 min-h-screen space-y-6 md:space-y-8">
        <MovieGrid title="Popular TV Shows" movies={deduplicateMovies(popSeries.Search || [])} />
        <MovieGrid title={`New Series ${currentYear}`} movies={deduplicateMovies(newSeries.Search || [])} />
        <MovieGrid title="HBO Originals" movies={deduplicateMovies(hboSeries.Search || [])} />
      </div>
    );
  } else if (type === "movie") {
    // Movies Mode
    const [popMovies, actionMovies, newMovies, comedyMovies] = await Promise.all([
      searchMovies("movie", "movie"),
      searchMovies("action", "movie"),
      searchMovies(currentYear.toString(), "movie"),
      searchMovies("comedy", "movie")
    ]);

    content = (
      <div className="pt-24 md:pt-28 min-h-screen space-y-6 md:space-y-8">
        <MovieGrid title="Popular Movies" movies={deduplicateMovies(popMovies.Search || [])} />
        <MovieGrid title={`${currentYear} Releases`} movies={deduplicateMovies(newMovies.Search || [])} />
        <MovieGrid title="Action & Adventure" movies={deduplicateMovies(actionMovies.Search || [])} />
        <MovieGrid title="Comedies" movies={deduplicateMovies(comedyMovies.Search || [])} />
      </div>
    );
  } else if (sort === "popular") {
    // Popular Mode
    const [trending, topRated, classics] = await Promise.all([
      searchMovies("best"),
      searchMovies("top"),
      searchMovies("classic")
    ]);

    content = (
      <div className="pt-24 md:pt-28 min-h-screen space-y-6 md:space-y-8">
        <MovieGrid title="Trending Now" movies={deduplicateMovies(trending.Search || [])} />
        <MovieGrid title="Top Rated" movies={deduplicateMovies(topRated.Search || [])} />
        <MovieGrid title="Classics" movies={deduplicateMovies(classics.Search || [])} />
      </div>
    );
  } else {
    // Default Home Mode - Show recent releases and trending
    const [featuredMovies, currentYearReleases, trending, popularSeries] = await Promise.all([
      getFeaturedMovies(),
      getReleasesByYear(currentYear),
      getTrendingContent(),
      searchMovies("series", "series")
    ]);

    content = (
      <>
        <HeroSlider movies={featuredMovies as MovieDetail[]} />
        <div className="relative z-30 space-y-4 md:space-y-6 lg:space-y-8 pb-12 bg-black">
          {/* Current year releases */}
          <MovieGrid title={`${currentYear} Releases`} movies={currentYearReleases} />
          
          {/* Previous year releases */}
          <MovieGrid title={`Best of ${previousYear}`} movies={trending.popular.slice(0, 20)} />
          
          {/* Marvel content */}
          <MovieGrid title="Marvel Universe" movies={trending.marvel} />
          
          {/* Popular series */}
          <MovieGrid title="Popular TV Shows" movies={deduplicateMovies(popularSeries.Search || [])} />
          
          {/* Netflix originals */}
          <MovieGrid title="Netflix Originals" movies={trending.netflix} />
        </div>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-black pb-20 overflow-x-hidden">
      <Suspense fallback={
        <div className="pt-32 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-white/10 rounded mx-auto" />
            <div className="h-4 w-32 bg-white/10 rounded mx-auto" />
          </div>
        </div>
      }>
        {content}
      </Suspense>
    </main>
  );
}
