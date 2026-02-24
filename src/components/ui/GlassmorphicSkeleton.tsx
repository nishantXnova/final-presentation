import { motion } from "framer-motion";

interface GlassmorphicSkeletonProps {
    className?: string;
    variant?: "default" | "card" | "text" | "circle";
}

export const GlassmorphicSkeleton = ({ className = "", variant = "default" }: GlassmorphicSkeletonProps) => {
    const variants = {
        default: "rounded-xl",
        card: "rounded-3xl",
        text: "rounded-full h-4",
        circle: "rounded-full",
    };

    return (
        <div className={`relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-lg ${variants[variant]} ${className}`}>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                    x: ["-100%", "200%"],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
};
