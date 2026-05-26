import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Garante o registro do plugin do GSAP para o ecossistema React
gsap.registerPlugin(useGSAP);

const ParticulasHero = () => {
  const containerRef = useRef(null);
  const totalParticulas = 40; // Altere aqui a quantidade de bolinhas

  useGSAP(() => {
    const particulas = gsap.utils.toArray('.particula');

    particulas.forEach((particula) => {
      // Função interna para criar o ciclo infinito individual de cada partícula
      const animarParticula = (isPrimeiraVez) => {
        // Se for o carregamento inicial, espalha pela tela. Depois, nascem sempre do fundo.
        const yInicial = isPrimeiraVez ? gsap.utils.random(10, 90) : 105;
        const duracao = gsap.utils.random(12, 22); // Segundos para atravessar a tela (mais lento = mais elegante)

        // 1. Configura o estado inicial/reset da partícula
        gsap.set(particula, {
          left: `${gsap.utils.random(0, 100)}%`,
          top: `${yInicial}%`,
          scale: gsap.utils.random(0.8, 0.8), // Mantém as partículas pequenas
          opacity: 0,
          x: 0,
          y: 0
        });

        // 2. Cria a linha do tempo da animação
        const tl = gsap.timeline({
          onComplete: () => animarParticula(false) // Quando termina, reinicia pelo fundo
        });

        tl.to(particula, {
          y: isPrimeiraVez ? `-${yInicial + 5}vh` : '-110vh', // Sobe até sumir no topo
          x: gsap.utils.random(-30, 30), // Leve balanço horizontal senoidal
          duration: isPrimeiraVez ? duracao * (yInicial / 100) : duracao, // Ajusta o tempo se já começar no meio
          ease: 'none'
        })
        // Fade In: Aparece suavemente ao subir
        .to(particula, { opacity: gsap.utils.random(0.2, 0.6), duration: 2 }, 0)
        // Fade Out: Desaparece suavemente 2 segundos antes de terminar a subida
        .to(particula, { opacity: 0, duration: 2 }, '-=2');
      };

      // Inicia a animação de cada uma com um pequeno delay para não subirem todas juntas
      gsap.delayedCall(gsap.utils.random(0, 5), () => animarParticula(true));
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none', // Permite clicar nos botões/textos do Hero por trás delas
        zIndex: 1, // Ajuste para ficar atrás do texto principal se preferir (ex: zIndex: 0)
      }}
    >
      {Array.from({ length: totalParticulas }).map((_, index) => (
        <div
          key={index}
          className="particula"
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            backgroundColor: '#4F311A', // O tom exato solicitado
            borderRadius: '50%',
            filter: 'blur(0.5px)', // Deixa as bordas menos duras e mais orgânicas
          }}
        />
      ))}
    </div>
  );
};

export default ParticulasHero;