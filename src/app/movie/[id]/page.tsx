import { getMovieDetail, getYouTubeTrailer } from "@/lib/omdb";
import { getHighResPoster } from "@/lib/image-utils";
import { Star, Clock, Calendar, Award, Users, Film, Globe, Flag, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import { YouTubeTrailer } from "./YouTubeTrailer";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetail(id);
  
  return {
    title: `${movie.Title} (${movie.Year}) - StreamVault`,
    description: movie.Plot || `Watch ${movie.Title} on StreamVault`,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  
  // Fetch movie details and trailer in parallel
  const [movie, trailer] = await Promise.all([
    getMovieDetail(id),
    getYouTubeTrailer(id, "") // We'll get the year from the movie
  ]);

  // If trailer search failed, try again with movie info
  let finalTrailer = trailer;
  if (!trailer && movie && movie.Title) {
    finalTrailer = await getYouTubeTrailer(movie.Title, movie.Year);
  }

  if (!movie || movie.Response === "False") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Movie not found</h1>
          <Link href="/" className="text-red-500 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Background */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/50 z-10" />
        <img
          src={getHighResPoster(movie.Poster)}
          alt={movie.Title}
          className="w-full h-full object-cover object-center opacity-40"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 -mt-[30vh] md:-mt-[25vh] pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Main Info Row */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="relative w-48 md:w-56 lg:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={getHighResPoster(movie.Poster)}
                  alt={movie.Title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {movie.Title}
              </h1>

              {/* Year, Runtime, Rated */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-300 mb-4">
                <span>{movie.Year}</span>
                {movie.Runtime && movie.Runtime !== "N/A" && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {movie.Runtime}
                    </span>
                  </>
                )}
                {movie.Rated && movie.Rated !== "N/A" && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <Badge variant="outline" className="text-gray-300 border-gray-500">
                      {movie.Rated}
                    </Badge>
                  </>
                )}
              </div>

              {/* Rating */}
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                    <Star className="w-5 h-5 fill-current" />
                    {movie.imdbRating}
                  </span>
                  <span className="text-gray-500">/10</span>
                  {movie.imdbVotes && movie.imdbVotes !== "N/A" && (
                    <span className="text-gray-500 text-sm">({movie.imdbVotes} votes)</span>
                  )}
                </div>
              )}

              {/* Genres */}
              {movie.Genre && movie.Genre !== "N/A" && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.Genre.split(", ").map((genre) => (
                    <Badge 
                      key={genre} 
                      className="bg-red-600/80 text-white hover:bg-red-600"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Plot */}
              {movie.Plot && movie.Plot !== "N/A" && (
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                  {movie.Plot}
                </p>
              )}

              {/* YouTube Trailer */}
              {finalTrailer && (
                <YouTubeTrailer 
                  videoId={finalTrailer.videoId} 
                  title={finalTrailer.title}
                />
              )}

              {/* Additional Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {movie.Director && movie.Director !== "N/A" && (
                  <div className="flex items-start gap-2">
                    <Film className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Director</p>
                      <p className="text-white">{movie.Director}</p>
                    </div>
                  </div>
                )}

                {movie.Writer && movie.Writer !== "N/A" && (
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Writer</p>
                      <p className="text-white">{movie.Writer}</p>
                    </div>
                  </div>
                )}

                {movie.Actors && movie.Actors !== "N/A" && (
                  <div className="flex items-start gap-2 md:col-span-2">
                    <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Cast</p>
                      <p className="text-white">{movie.Actors}</p>
                    </div>
                  </div>
                )}

                {movie.Language && movie.Language !== "N/A" && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Language</p>
                      <p className="text-white">{movie.Language}</p>
                    </div>
                  </div>
                )}

                {movie.Country && movie.Country !== "N/A" && (
                  <div className="flex items-start gap-2">
                    <Flag className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Country</p>
                      <p className="text-white">{movie.Country}</p>
                    </div>
                  </div>
                )}

                {movie.Released && movie.Released !== "N/A" && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Release Date</p>
                      <p className="text-white">{movie.Released}</p>
                    </div>
                  </div>
                )}

                {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                  <div className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Box Office</p>
                      <p className="text-white">{movie.BoxOffice}</p>
                    </div>
                  </div>
                )}

                {movie.Awards && movie.Awards !== "N/A" && (
                  <div className="flex items-start gap-2 md:col-span-2">
                    <Award className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Awards</p>
                      <p className="text-white">{movie.Awards}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ratings from other sources */}
              {movie.Ratings && movie.Ratings.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white font-semibold mb-3">Ratings</h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.Ratings.map((rating) => (
                      <div 
                        key={rating.Source} 
                        className="bg-white/10 rounded-lg px-4 py-2"
                      >
                        <p className="text-gray-400 text-sm">{rating.Source}</p>
                        <p className="text-white font-bold">{rating.Value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IMDB Link */}
              <div className="mt-6">
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on IMDB
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
