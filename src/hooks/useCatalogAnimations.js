import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export function useCatalogAnimations() {

    const heroRef = useRef(null);
    const toolbarRef = useRef(null);
    const sidebarRef = useRef(null);
    const gridRef = useRef(null);

    useGSAP(() => {

        const tl = gsap.timeline({

            defaults:{

                ease:"power3.out"

            }

        });

        tl.from(heroRef.current,{

            opacity:0,
            y:70,
            duration:.9

        });

        tl.from(toolbarRef.current,{

            opacity:0,
            y:35,
            duration:.6

        },"-=.45");

        tl.from(sidebarRef.current,{

            opacity:0,
            x:-40,
            duration:.6

        },"-=.35");

        tl.from(gridRef.current,{

            opacity:0,
            y:35,
            duration:.7

        },"-=.4");

    });

    return{

        heroRef,
        toolbarRef,
        sidebarRef,
        gridRef

    };

}