"use client";

import { useRef, useEffect } from "react";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  connections: Particle[];

  constructor(canvas: HTMLCanvasElement, x?: number, y?: number) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(220, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 50}%)`;
    this.connections = [];
  }

  update(canvas: HTMLCanvasElement, particles: Particle[]) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    this.connections = particles.filter(
      (p) => Math.hypot(this.x - p.x, this.y - p.y) < 100 && p !== this
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    this.connections.forEach((p) => {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 0.1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    });
  }
}

export default function QuantumBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let animationFrameId: number;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element is null");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context is null");
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 150;

    // Narrowed scope ensures canvas is non-null here
    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas)); // Line 79: canvas is guaranteed non-null
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.fillStyle = "rgba(10, 11, 30, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas, particles);
        particles[i].draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      for (let i = 0; i < 3; i++) {
        const particle = new Particle(canvas, x, y);
        particle.size = Math.random() * 5 + 2;
        particle.speedX = Math.random() * 5 - 2.5;
        particle.speedY = Math.random() * 5 - 2.5;
        particle.color = `hsl(220, ${Math.random() * 50 + 50}%, ${
          Math.random() * 30 + 70
        }%)`;
        particles.push(particle);
      }
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}