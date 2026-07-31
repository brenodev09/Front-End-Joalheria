import { useRef } from "react";
import gsap from "gsap";

export function useCardTilt() {

    const cardRef = useRef(null);

    const handleMouseMove = (event) => {

        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 1200,
            duration: 0.35,
            ease: "power3.out",
        });

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleMouseLeave = () => {

        if (!cardRef.current) return;

        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: .6,
            ease: "power3.out",
        });
    };

    return {
        cardRef,
        handleMouseMove,
        handleMouseLeave,
    };
}