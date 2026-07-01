import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acc2026 } from "./acc-2026";

function TiltCard({
  children,
  className = "",
  badge,
}: {
  children: React.ReactNode;
  className?: string;
  badge?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const current = useRef({ x: 0.5, y: 0.5, gx: 0.5, gy: 0.5 });
  const hovering = useRef(false);

  const loop = useCallback(() => {
    const spd = hovering.current ? 0.08 : 0.04;
    const tx = hovering.current ? mouse.current.x : 0.5;
    const ty = hovering.current ? mouse.current.y : 0.5;
    current.current.x += (tx - current.current.x) * spd;
    current.current.y += (ty - current.current.y) * spd;
    current.current.gx += (tx - current.current.gx) * 0.12;
    current.current.gy += (ty - current.current.gy) * 0.12;
    const rx = (current.current.y - 0.5) * -12;
    const ry = (current.current.x - 0.5) * 12;
    const mx = (current.current.x - 0.5) * 5;
    const my = (current.current.y - 0.5) * 5;
    const s = hovering.current ? 1.015 : 1;
    if (cardRef.current)
      cardRef.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translate(${mx}px, ${my}px) scale(${s})`;
    if (glowRef.current)
      glowRef.current.style.background = `radial-gradient(400px circle at ${current.current.gx * 100}% ${current.current.gy * 100}%, rgba(255,255,255,0.04), transparent 40%)`;
    rafId.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [loop]);

  const handleMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    mouse.current.x = (e.clientX - r.left) / r.width;
    mouse.current.y = (e.clientY - r.top) / r.height;
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      className="relative w-full max-w-md cursor-default"
    >
      {badge && (
        <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-background">
          {badge}
        </div>
      )}
      <div
        ref={cardRef}
        className={`relative h-full overflow-hidden rounded-xl ${className}`}
        style={{ willChange: "transform" }}
      >
        <div ref={glowRef} className="pointer-events-none absolute inset-0 z-[2]" />
        <div className="relative z-[3] flex h-full flex-col p-8">{children}</div>
      </div>
    </div>
  );
}

interface FeatureItem {
  text: string;
  bold?: string;
  after?: string;
  tag?: string;
}

function FeatureRow({
  item,
  dim = false,
}: {
  item: FeatureItem;
  dim?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Check
        size={14}
        strokeWidth={2.5}
        className={`mt-0.5 shrink-0 ${dim ? "text-foreground/30" : "text-foreground/70"}`}
      />
      <span className={`text-sm leading-relaxed ${dim ? "text-foreground/45" : "text-foreground/75"}`}>
        {item.bold ? (
          <>
            {item.text}
            <strong className="text-foreground">{item.bold}</strong>
            {item.after}
          </>
        ) : (
          item.text
        )}
        {item.tag && (
          <span className="ml-2 inline-block rounded bg-foreground/10 px-1.5 py-0.5 align-middle text-[9px] font-semibold uppercase tracking-wide text-foreground/40">
            {item.tag}
          </span>
        )}
      </span>
    </div>
  );
}

export default function Tickets() {
  const virtualFeatures: FeatureItem[] = [
    { text: "HD Multi-Camera Livestream of every mainstage session" },
    { text: "Live Q&A — submit questions directly to speakers in real time" },
    { text: "Access to the official event Discord for networking and discussion" },
    { text: "Post-event speaker slides and resource links" },
  ];

  const generalFeatures: FeatureItem[] = [
    { text: "$100 Akash Compute Credits", tag: "100% Subsidized" },
    { text: "Hardware Giveaways: Eligible for", bold: " Mac Minis, RTX 5090s", after: ", and high-end tech drops", tag: "GPU Drops" },
    { text: "Full Access to Mainstage & Live Breakout Rooms" },
    { text: "Hands-On Workshop Floor & Hacking Zones. Bring your laptop." },
    { text: "Exclusive Premium Akash Merch & Swag Bundle" },
    { text: "All-Day Catering: Craft coffee, lunch, and Holbrook House Happy Hour" },
  ];

  return (
    <section id="tickets" className="bg-black py-20">
      <div className="container">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            One event. Two ways in.
          </h2>
          <p className="mx-auto max-w-md text-base leading-relaxed text-para">
            Early Bird pricing ends {acc2026.earlyBirdDeadline}. In-person limited to 1,000 attendees.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Virtual — Free */}
          <TiltCard className="bg-[#0D0D0E]">
            <span className="mb-4 inline-flex self-start items-center rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/55">
              Virtual Pass
            </span>
            <div className="mb-5">
              <span className="text-3xl font-bold tracking-tight text-foreground">Free</span>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              {virtualFeatures.map((item, i) => (
                <FeatureRow key={i} item={item} dim />
              ))}
            </div>
            <a href={acc2026.calendarLink} target="_blank" rel="noopener noreferrer" className="mt-7 block">
              <Button variant="outline" className="w-full gap-2">
                Join Virtually — Add to Calendar <ArrowUpRight size={14} />
              </Button>
            </a>
          </TiltCard>

          {/* General — $99 (featured) */}
          <TiltCard className="border border-white/[0.1] bg-[#0D0D0E]">
            <span className="mb-4 inline-flex self-start items-center rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/55">
              General In-Person
            </span>
            <div className="mb-5">
              <span className="text-3xl font-bold tracking-tight text-foreground">$99</span>
              <span className="ml-2 text-sm text-foreground/40">/ Early Bird</span>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              {generalFeatures.map((item, i) => (
                <FeatureRow key={i} item={item} />
              ))}
            </div>
            <a href={acc2026.register} target="_blank" rel="noopener noreferrer" className="mt-7 block">
              <Button className="w-full gap-2 !bg-white !text-black hover:!bg-white/90">
                Get Early Bird Pass ($99) <ArrowUpRight size={14} />
              </Button>
            </a>
          </TiltCard>

        </motion.div>
      </div>
    </section>
  );
}
