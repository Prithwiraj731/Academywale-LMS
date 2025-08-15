"use client";

import React, { useEffect, useRef, useState } from "react";

const VenomBeam = ({ 
  className = "" 
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
    let nodeCount = 180; // Increased for better density
    
    // Node properties
    const initNodes = () => {
      nodes = [];
      const width = canvas.width;
      const height = canvas.height;
      
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const vx = Math.random() * 0.15 - 0.075; // Slightly slower movement
        const vy = Math.random() * 0.15 - 0.075;
        
        nodes.push({
          x,
          y,
          vx,
          vy,
          radius: Math.random() * 1.2 + 0.5,
          lastUpdate: Date.now(),
          connectionDistance: Math.random() * 100 + 60,
          fillColor: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.05})`,
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
      // Lighter shade for connections - closer to the example
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.25})`;
      ctx.lineWidth = Math.min(0.8, alpha * 0.6);
      ctx.stroke();
    };
    
    const drawNode = (node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.fillColor;
      ctx.fill();
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
        
        // Basic movement
        node.x += node.vx * deltaTime;
        node.y += node.vy * deltaTime;
        
        // Boundary checking
        if (node.x < 0 || node.x > canvas.width) {
          node.vx = -node.vx;
        }
        
        if (node.y < 0 || node.y > canvas.height) {
          node.vy = -node.vy;
        }
        
        // Mouse/touch interaction
        const interactionPoint = touchRef.current.isActive ? touchPos : mousePos;
        const dx = interactionPoint.x - node.x;
        const dy = interactionPoint.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) { // Increased interaction radius
          const force = (150 - distance) / 150;
          const angle = Math.atan2(dy, dx);
          node.vx -= Math.cos(angle) * force * 0.015 * deltaTime; // Stronger repulsion
          node.vy -= Math.sin(angle) * force * 0.015 * deltaTime;
        }
        
        // Slight dampening for stability
        node.vx *= 0.99;
        node.vy *= 0.99;
        
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
      className={`particles-container ${className || ''}`}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          width: '100%',
          height: '100%',
          background: '#111827',
          opacity: 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};

export default VenomBeam;
