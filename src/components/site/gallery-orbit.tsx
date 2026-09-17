"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import type { GalleryPhoto } from "@/lib/supabase/types";

interface GalleryOrbitProps {
  photos: GalleryPhoto[];
}

const AUTOPLAY_MS = 2200;

// Distância circular com sinal: negativo = à esquerda do item ativo,
// positivo = à direita, sempre pelo caminho mais curto ao redor do
// conjunto (é isso que faz o "fim" da lista voltar a ficar ao lado do
// "início" em vez de dar a volta inteira quando total é pequeno).
function circularOffset(i: number, active: number, total: number) {
  let diff = i - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function useOrbitGeometry() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop
    ? {
        isDesktop,
        spacingX: 240,
        spacingZ: 210,
        rotate: 26,
        scaleStep: 0.15,
        width: 300,
        height: 400,
        perspective: 1600,
        previewScale: 1.7,
        previewZ: 170,
      }
    : {
        isDesktop,
        spacingX: 118,
        spacingZ: 130,
        rotate: 18,
        scaleStep: 0.17,
        width: 178,
        height: 237,
        perspective: 1000,
        previewScale: 1.55,
        previewZ: 95,
      };
}

// Órbita 3D de fotografias com rotação ambiente contínua (revisão de
// 2026-09-16, a pedido da cliente: sem setas/botões — a única forma de a
// composição mudar é o giro automático sozinho. Passar o mouse, o dedo ou
// o foco do teclado por cima de qualquer foto (não só a central) dá um
// "close" nela — cresce, vem pra frente, encara a câmera — enquanto as
// demais desfocam e escurecem ao redor, sem alterar a rotação. Ao soltar/
// sair, ela volta sozinha pro lugar na órbita.
export function GalleryOrbit({ photos }: GalleryOrbitProps) {
  const [active, setActive] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const geometry = useOrbitGeometry();

  const total = photos.length;
  const canNavigate = total > 1;

  // Rotação automática é a ÚNICA forma de navegação (sem setas/drag) —
  // pausa enquanto uma foto está em preview (hover/toque/foco) pra não
  // fugir debaixo do usuário, e nunca roda sozinha com reduced-motion
  // (nesse caso a galeria ainda é 100% navegável: cada foto abre em
  // destaque ao receber foco do teclado, só sem o giro automático).
  useEffect(() => {
    if (reduceMotion || !canNavigate || previewIndex !== null) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduceMotion, canNavigate, total, previewIndex]);

  const orbitTransition = { duration: reduceMotion ? 0.15 : 0.6, ease: EASE };
  const previewTransition = { duration: reduceMotion ? 0.12 : 0.4, ease: EASE };

  return (
    <div className="mt-12 sm:mt-16">
      <div
        role="group"
        aria-label="Galeria de trabalhos da Fialho Barbearia"
        className="relative mx-auto h-[300px] w-full max-w-full sm:h-[440px]"
        style={{ perspective: geometry.perspective }}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {photos.map((photo, i) => {
            const offset = circularOffset(i, active, total);
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;
            const isHidden = absOffset > 3;
            const isPreviewed = previewIndex === i;
            const isDimmed = previewIndex !== null && !isPreviewed;
            const showAccent = isPreviewed || (previewIndex === null && isActive);

            function setPreviewOn() {
              if (!isHidden) setPreviewIndex(i);
            }
            function setPreviewOff() {
              setPreviewIndex((current) => (current === i ? null : current));
            }

            return (
              <motion.div
                key={photo.id}
                className={`absolute top-1/2 left-1/2 outline-none ${isHidden ? "pointer-events-none" : ""}`}
                style={{
                  width: geometry.width,
                  height: geometry.height,
                  marginLeft: -geometry.width / 2,
                  marginTop: -geometry.height / 2,
                }}
                animate={
                  isPreviewed
                    ? {
                        x: 0,
                        z: geometry.previewZ,
                        rotateY: 0,
                        scale: geometry.previewScale,
                        opacity: 1,
                        filter: "blur(0px)",
                      }
                    : {
                        x: offset * geometry.spacingX,
                        z: -absOffset * geometry.spacingZ,
                        rotateY: offset * -geometry.rotate,
                        scale: Math.max(1 - absOffset * geometry.scaleStep, 0.5),
                        opacity: isHidden ? 0 : isDimmed ? 0.32 : Math.max(1 - absOffset * 0.24, 0.3),
                        filter: isDimmed ? "blur(5px)" : "blur(0px)",
                      }
                }
                transition={isPreviewed ? previewTransition : orbitTransition}
                onMouseEnter={setPreviewOn}
                onMouseLeave={setPreviewOff}
                onFocus={setPreviewOn}
                onBlur={setPreviewOff}
                onTouchStart={setPreviewOn}
                onTouchEnd={setPreviewOff}
                onTouchCancel={setPreviewOff}
                tabIndex={isHidden ? -1 : 0}
                aria-label={
                  photo.category ? `Ver detalhe: ${photo.category}` : "Ver foto da Fialho Barbearia"
                }
              >
                <div
                  className={`relative h-full w-full overflow-hidden border bg-brand-ink transition-colors duration-500 ${
                    showAccent ? "border-brand-red" : "border-brand-cream/10"
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt=""
                    fill
                    sizes={geometry.isDesktop ? "300px" : "178px"}
                    priority={i === 0}
                    draggable={false}
                    className="object-cover"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
