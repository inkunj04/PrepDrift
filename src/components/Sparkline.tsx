import { useEffect, useRef } from 'react';
import type { SparklineData } from '@/types';

interface SparklineProps {
  data: SparklineData;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 64,
  height = 24,
  color = '#4F46E5',
  className,
}: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;

    const stepX = (width - padding * 2) / (data.length - 1);

    ctx.clearRect(0, 0, width, height);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    data.forEach((value, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Draw end dot
    const lastX = padding + (data.length - 1) * stepX;
    const lastY = height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(lastX, lastY, 2, 0, Math.PI * 2);
    ctx.fill();
  }, [data, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
