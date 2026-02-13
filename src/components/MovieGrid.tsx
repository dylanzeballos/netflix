import { Card, CardContent } from "@/components/ui/card";
import { Movie } from "@/lib/omdb";
import { getHighResPoster } from "@/lib/image-utils";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface MovieGridProps {
    title: string;
    movies: Movie[];
}

// Filter movies to only show those with valid posters
function filterMoviesWithPosters(movies: Movie[]): Movie[] {
    return movies.filter(movie => 
        movie.Poster && 
        movie.Poster !== "N/A" && 
        movie.Poster.trim() !== ""
    );
}

export function MovieGrid({ title, movies }: MovieGridProps) {
    const validMovies = filterMoviesWithPosters(movies);
    
    if (validMovies.length === 0) {
        return (
            <div className="w-full py-6 md:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
                        {title}
                    </h2>
                    <div className="py-8 text-center">
                        <div className="text-gray-500 text-lg">No content available</div>
                        <p className="text-gray-600 text-sm mt-2">Try exploring other categories</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                        {title}
                    </h2>
                    <span className="text-sm text-gray-500 hidden sm:block">
                        {validMovies.length} titles
                    </span>
                </div>

                {/* Responsive Grid - max 4 columns on large screens */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                    {validMovies.map((movie) => (
                        <Link 
                            key={movie.imdbID} 
                            href={`/movie/${movie.imdbID}`}
                            className="block group"
                        >
                            <div 
                                className="relative aspect-[2/3] transition-all duration-300 hover:scale-105 hover:z-10"
                            >
                                <Card className="border-0 bg-transparent shadow-none h-full overflow-hidden rounded-lg">
                                    <CardContent className="p-0 relative h-full rounded-lg overflow-hidden bg-gray-800">
                                        {/* Poster Image */}
                                        <img
                                            src={getHighResPoster(movie.Poster)}
                                            alt={movie.Title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Hover Content */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            {/* Type Badge */}
                                            <Badge 
                                                variant="secondary" 
                                                className="absolute top-2 right-2 bg-red-600/90 text-white border-0 text-[10px] md:text-xs uppercase"
                                            >
                                                {movie.Type === "movie" ? "Movie" : "TV"}
                                            </Badge>

                                            {/* Title */}
                                            <h3 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2 drop-shadow-lg">
                                                {movie.Title}
                                            </h3>
                                            
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {movie.Year}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
