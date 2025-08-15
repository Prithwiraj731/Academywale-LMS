import React, { useEffect, useRef } from "react";

/**
 * VenomBeam component - Creates an interactive particle network animation
 */
const VenomBeam = ({ 
  className = "",
  children 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas sizing
    const setupCanvas = () => {
      // Get DPR and size for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set the canvas size and scale
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Create particles on resize
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const count = 100; // Number of particles
      
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: Math.random() * 2 + 1,
          color: `rgba(32, 178, 170, ${Math.random() * 0.5 + 0.25})`, // Teal color
        });
      }
    };

    // Track mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
      };
    };
    
    // Handle touch events for mobile
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
          y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)
        };
      }
    };

    // Animation loop
    const animate = () => {
      // Clear canvas with slight opacity for trails
      ctx.fillStyle = "rgba(17, 24, 39, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((p, i) => {
        // Move particles
        p.x += p.vx;
        p.y += p.vy;
        
        // Boundary check with wrap-around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const angle = Math.atan2(dy, dx);
          const force = (120 - dist) / 120;
          p.vx -= Math.cos(angle) * force * 0.02;
          p.vy -= Math.sin(angle) * force * 0.02;
        }
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Connect particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Fade connections by distance
            const alpha = (100 - dist) / 100 * 0.3;
            ctx.strokeStyle = `rgba(32, 178, 170, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Set up events and start animation
    window.addEventListener("resize", setupCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);
    
    setupCanvas();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", setupCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bg-gray-900"
        style={{ display: 'block' }}
      />
      <div className={`absolute inset-0 ${className}`}>{children}</div>
      
      {/* Fixed animated dots for visual effect */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#20b2aa] rounded-full animate-pulse opacity-60" />
      <div className="absolute top-40 right-20 w-1 h-1 bg-[#20b2aa] rounded-full animate-pulse opacity-40" />
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#20b2aa] rounded-full animate-pulse opacity-50" />
      <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-[#20b2aa] rounded-full animate-pulse opacity-30" />
    </div>
  );
};

export default VenomBeam;
