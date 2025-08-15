"use client";

import React, { useEffect, useRef } from "react";

const VenomBeam = ({ 
  className = "",
  children 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const touchRef = useRef({ x: 0, y: 0, isActive: false });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Initialize nodes
      initNodes();
    };
    
    let nodes = [];
    let nodeCount = 150; // Exact node count from ScrollX UI
    
    // Node properties
    const initNodes = () => {
      nodes = [];
      const width = canvas.width;
      const height = canvas.height;
      
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const vx = Math.random() * 0.2 - 0.1; // Faster movement like in the demo
        const vy = Math.random() * 0.2 - 0.1;
        
        nodes.push({
          x,
          y,
          vx,
          vy,
          radius: Math.random() * 1.5 + 0.5,
          lastUpdate: Date.now(),
          connectionDistance: Math.random() * 120 + 60,
          fillColor: `rgba(32, 178, 170, ${Math.random() * 0.5 + 0.1})`, // Using the teal color (#20b2aa)
        });
      }
    };
    
    // Handle mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    // Handle touch movement
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        touchRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          isActive: true,
        };
      }
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        touchRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          isActive: true,
        };
      }
    };
    
    const handleTouchEnd = () => {
      touchRef.current.isActive = false;
    };
    
    // Drawing functions
    const drawConnection = (x1, y1, x2, y2, distance, maxDistance) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      
      const alpha = 1 - distance / maxDistance;
      // Use teal color for connections like in the demo
      ctx.strokeStyle = `rgba(32, 178, 170, ${alpha * 0.3})`;
      ctx.lineWidth = Math.min(1.0, alpha * 0.8);
      ctx.stroke();
    };
    
    const drawNode = (node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.fillColor;
      ctx.fill();
      
      // Add a subtle glow for bigger particles
      if (node.radius > 1) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, node.radius * 0.5,
          node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, `rgba(32, 178, 170, 0.3)`);
        gradient.addColorStop(1, `rgba(32, 178, 170, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = Date.now();
      const mousePos = mouseRef.current;
      const touchPos = touchRef.current;
      
      // Update and draw nodes
      for (const node of nodes) {
        const deltaTime = (currentTime - node.lastUpdate) / 16.67; // Normalize to ~60fps
        node.lastUpdate = currentTime;
        
        // Faster movement like in the demo
        node.x += node.vx * deltaTime * 1.2;
        node.y += node.vy * deltaTime * 1.2;
        
        // Boundary checking with wrap-around for smoother effect
        if (node.x < -50) {
          node.x = canvas.width + 50;
        } else if (node.x > canvas.width + 50) {
          node.x = -50;
        }
        
        if (node.y < -50) {
          node.y = canvas.height + 50;
        } else if (node.y > canvas.height + 50) {
          node.y = -50;
        }
        
        // Mouse/touch interaction
        const interactionPoint = touchRef.current.isActive ? touchPos : mousePos;
        const dx = interactionPoint.x - node.x;
        const dy = interactionPoint.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) { // Increased interaction radius for better effect
          const force = (200 - distance) / 200;
          const angle = Math.atan2(dy, dx);
          node.vx -= Math.cos(angle) * force * 0.02 * deltaTime; // Stronger repulsion
          node.vy -= Math.sin(angle) * force * 0.02 * deltaTime;
        }
        
        // Less dampening for faster animation
        node.vx *= 0.995;
        node.vy *= 0.995;
        
        // Draw node
        drawNode(node);
      }
      
      // Draw connections between nodes
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const maxDistance = (nodeA.connectionDistance + nodeB.connectionDistance) / 2;
          
          if (distance < maxDistance) {
            drawConnection(nodeA.x, nodeA.y, nodeB.x, nodeB.y, distance, maxDistance);
          }
        }
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Set up resize listener and initial sizes
    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();
    
    // Set up mouse and touch event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className || ''}`}
      style={{ 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ 
          width: '100%',
          height: '100%',
          background: '#111827',
          opacity: 1,
          transition: 'opacity 0.3s ease'
        }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default VenomBeam;
