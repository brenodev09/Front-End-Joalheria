import { useEffect, useState } from "react";

export default function useContador(dataAlvo) {
    const calcularTempo = () => {
        if (!dataAlvo) {
            return {
                dias: 0,
                horas: 0,
                minutos: 0,
                segundos: 0,
                encerrado: true
            };
        }

        const agora = new Date();
        const alvo = new Date(dataAlvo);

        const diferenca = alvo.getTime() - agora.getTime();

        if (diferenca <= 0) {
            return {
                dias: 0,
                horas: 0,
                minutos: 0,
                segundos: 0,
                encerrado: true
            };
        }

        return {
            dias: Math.floor(diferenca / (1000 * 60 * 60 * 24)),
            horas: Math.floor(
                (diferenca / (1000 * 60 * 60)) % 24
            ),
            minutos: Math.floor(
                (diferenca / (1000 * 60)) % 60
            ),
            segundos: Math.floor(
                (diferenca / 1000) % 60
            ),
            encerrado: false
        };
    };

    const [tempo, setTempo] = useState(calcularTempo);

    useEffect(() => {
        setTempo(calcularTempo());

        const intervalo = setInterval(() => {
            setTempo(calcularTempo());
        }, 1000);

        return () => clearInterval(intervalo);
    }, [dataAlvo]);

    return tempo;
}