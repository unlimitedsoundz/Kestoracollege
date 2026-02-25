'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CaretLeft, CaretRight, Quotes as Quote } from "@phosphor-icons/react/dist/ssr";

const stories = [
    {
        id: 1,
        name: 'Uchida Ideguchi',
        programme: "Bachelor's in International Business",
        quote: "SYKLI College provided me with a unique multidisciplinary environment where I could combine my interest in tech with business strategy. The practical projects were eye-opening.",
        image: '/images/admissions/student_stories_1.png'
    },
    {
        id: 2,
        name: 'Maria Petrova',
        programme: "Master's in Design Management",
        quote: "Studying in Finland has been a life-changing experience. The focus on work-life balance and deep collaborative research at SYKLI is truly world-class.",
        image: '/images/admissions/student_stories_2.png'
    }
];

export default function StudentStoriesCarousel() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % stories.length);
    const prev = () => setCurrent((prev) => (prev - 1 + stories.length) % stories.length);

    return (
        <div className="relative w-full h-[400px] overflow-hidden bg-neutral-900 group">
            {stories.map((story, index) => (
                <div
                    key={story.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        className="object-cover opacity-60"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-16 pb-24 md:pb-16">
                        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Quote size={32} weight="fill" className="text-[#fd6402] mb-4 md:mb-6 opacity-50" />
                            <p className="text-lg md:text-2xl text-white font-medium italic leading-relaxed mb-6 md:mb-8">
                                "{story.quote}"
                            </p>
                            <div>
                                <h4 className="text-lg md:text-xl font-bold text-white">{story.name}</h4>
                                <p className="text-sm md:text-base text-neutral-400">{story.programme}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex gap-3 md:gap-4 z-20">
                <button
                    onClick={prev}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white transition-all hover:bg-white/10 active:scale-95"
                >
                    <CaretLeft size={20} weight="bold" className="md:w-6 md:h-6" />
                </button>
                <button
                    onClick={next}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white transition-all hover:bg-white/10 active:scale-95"
                >
                    <CaretRight size={20} weight="bold" className="md:w-6 md:h-6" />
                </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 flex gap-2 z-20">
                {stories.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-8 md:w-12 h-1 transition-all ${i === current ? 'bg-[#fd6402]' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
