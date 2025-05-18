"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon, CheckIcon } from "lucide-react";

interface SignatureCanvasProps {
  onSignatureComplete: (signatureData: string) => void;
  className?: string;
}

export default function SignatureCanvas({
  onSignatureComplete,
  className,
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  // Initialize canvas context
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      // Set up the context for brush-like strokes
      context.lineJoin = "round";
      context.lineCap = "round";
      context.lineWidth = 2;
      context.strokeStyle = "#000000";
      setCtx(context);
    }

    // Handle resize
    const handleResize = () => {
      if (canvas && context) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Save current drawing
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
        }

        // Resize canvas
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        context.scale(dpr, dpr);

        // Restore drawing
        context.drawImage(tempCanvas, 0, 0);

        // Reset context properties after resize
        context.lineJoin = "round";
        context.lineCap = "round";
        context.lineWidth = 2;
        context.strokeStyle = "#000000";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Drawing functions
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    // Get point coordinates
    const point = getPointCoordinates(e);
    setLastPoint(point);

    // Start a new path
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !ctx || !lastPoint) return;

    // Prevent scrolling on touch devices
    e.preventDefault();

    // Get current point
    const currentPoint = getPointCoordinates(e);

    // Draw line from last point to current point
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);

    // Create a brush-like effect with varying opacity and width
    const midPoint = {
      x: (lastPoint.x + currentPoint.x) / 2,
      y: (lastPoint.y + currentPoint.y) / 2,
    };

    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    if (!isDrawing || !ctx || !canvasRef.current) return;

    setIsDrawing(false);
    setLastPoint(null);

    // Complete the path
    ctx.closePath();
  };

  const getPointCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current) {
      return { x: 0, y: 0 };
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Handle both mouse and touch events
    if ("touches" in e) {
      // Touch event
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const clearSignature = () => {
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSignature(false);
  };

  const completeSignature = () => {
    if (!canvasRef.current || !hasSignature) return;

    const signatureData = canvasRef.current.toDataURL("image/png");
    onSignatureComplete(signatureData);
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="w-full max-w-md relative">
        {/* Canvas container with border */}
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-32 touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Instruction text */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Please sign above using your mouse, finger, or stylus
        </p>

        {/* Action buttons */}
        <div className="flex justify-center mt-4 space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignature}
            className="text-gray-600 dark:text-gray-300"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Clear
          </Button>

          <Button
            size="sm"
            onClick={completeSignature}
            disabled={!hasSignature}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            Confirm Signature
          </Button>
        </div>
      </div>
    </div>
  );
}
