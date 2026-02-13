"use client";

import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Info, Star } from "lucide-react";
import { MovieDetail } from "@/lib/omdb";
import { getHighResPoster } from "@/lib/image-utils";
import Link from "next/link";

interface HeroSliderProps {
    movies: MovieDetail[];
}

// Filter movies with valid posters and limit to 5
function getValidFeaturedMovies(movies: MovieDetail[]): MovieDetail[] {
    return movies
        .filter(movie => movie.Poster && movie.Poster !== "N/A")
        .slice(0, 5);
}

export function HeroSlider({ movies }: HeroSliderProps) {
    const validMovies = getValidFeaturedMovies(movies);
    
    if (validMovies.length === 0) {
        return null;
    }

    return (
        <Carousel
            className="w-full relative group"
            plugins={[
                Autoplay({
                    delay: 6000,
                    stopOnInteraction: true,
                }),
            ]}
            opts={{
                loop: true,
            }}
        >
            <CarouselContent>
                {validMovies.map((movie) => (
                    <CarouselItem key={movie.imdbID} className="relative h-[70vh] md:h-[85vh] w-full">
                        <div className="absolute inset-0">
                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10" />

                            {/* Background Image */}
                            <img
                                src={getHighResPoster(movie.Poster)}
                                alt={movie.Title}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>

                        {/* Content */}
                        <div className="container relative z-20 h-full flex items-end md:items-center pb-16 md:pb-0 px-4 md:px-8">
                            <div className="max-w-2xl space-y-4 md:space-y-6">
                                {/* Title */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                    {movie.Title}
                                </h1>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base text-gray-200">
                                    {movie.imdbRating && movie.imdbRating !== "N/A" && (
                                        <span className="flex items-center gap-1 text-yellow-400 font-bold">
                                            <Star className="w-4 h-4 fill-current" />
                                            {movie.imdbRating}
                                        </span>
                                    )}
                                    <span className="text-gray-300">{movie.Year}</span>
                                    {movie.Rated && movie.Rated !== "N/A" && (
                                        <span className="border border-gray-500 px-1.5 py-0.5 rounded text-xs md:text-sm text-gray-300">
                                            {movie.Rated}
                                        </span>
                                    )}
                                    {movie.Runtime && movie.Runtime !== "N/A" && (
                                        <span className="text-gray-300">{movie.Runtime}</span>
                                    )}
                                </div>

                                {/* Plot */}
                                <p className="text-base md:text-lg text-gray-300 line-clamp-2 md:line-clamp-3 max-w-xl drop-shadow-lg">
                                    {movie.Plot}
                                </p>

                                {/* Genre Tags */}
                                {movie.Genre && (
                                    <div className="flex flex-wrap gap-2">
                                        {movie.Genre.split(", ").slice(0, 3).map((genre) => (
                                            <span 
                                                key={genre} 
                                                className="text-xs md:text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Action Button - Only More Info */}
                                <div className="pt-2">
                                    <Link href={`/movie/${movie.imdbID}`}>
                                        <Button 
                                            size="lg" 
                                            className="bg-white/20 text-white hover:bg-white/30 gap-2 font-bold px-6 md:px-8 text-base md:text-lg h-11 md:h-12 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                        >
                                            <Info className="h-5 w-5" /> 
                                            More Info
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex h-12 w-12 border-none bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm" />
            <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex h-12 w-12 border-none bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm" />
        </Carousel>
    );
}
