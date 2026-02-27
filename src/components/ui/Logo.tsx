import Link from "next/link"
import Image from "next/image"

export function Logo({ className = "", onClick }: { className?: string, onClick?: () => void }) {
    const isDarkBackground = className.includes('text-white') || className.includes('brightness-0');

    return (
        <Link
            href="/"
            className={`flex items-center gap-2 group ${className}`}
            onClick={onClick}
        >
            <div className={`relative transition-all duration-300 ${isDarkBackground ? 'mix-blend-screen' : 'brightness-100 invert grayscale mix-blend-multiply'}`}>
                <Image
                    src="/logo-kestora.png"
                    alt="Kestora College"
                    width={200}
                    height={200}
                    className={`object-contain w-auto ${className}`}
                    priority
                />
            </div>
        </Link>
    )
}
