export function GeometricPattern({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="islamic-pattern"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                >
                    {/* A simple geometric star/hex pattern */}
                    <path
                        d="M10 0 L20 5 L20 15 L10 20 L0 15 L0 5 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        opacity="0.2"
                    />
                    <path
                        d="M10 0 L10 20 M0 5 L20 15 M20 5 L0 15"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        opacity="0.1"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
    );
}
