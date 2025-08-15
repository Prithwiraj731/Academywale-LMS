"use client";

import React, { useRef, useEffect } from "react";

const VenomBeam = ({ 
  className = "" 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext("2d");
    const particles = [];
    const particleCount = 120;
    let mouse = { x: 0, y: 0, radius: 180 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const handleResize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      particles.length = 0;
      init();
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 25 + 5;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.friction = 0.95;
        this.links = [];
        this.distance = Math.random() * 120 + 80;
      }

      update() {
        // Basic motion
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        
        // Calculate force to apply
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        
        // Apply force if within radius
        if (distance < maxDistance && force > 0) {
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;
          
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Return to original position
          if (this.x !== this.baseX) {
            const dx = this.baseX - this.x;
            this.x += dx * 0.03;
          }
          if (this.y !== this.baseY) {
            const dy = this.baseY - this.y;
            this.y += dy * 0.03;
          }
        }
        
        // Add random movement
        this.x += (Math.random() - 0.5) * 0.3;
        this.y += (Math.random() - 0.5) * 0.3;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill();
      }

      // Find nearby particles to form connections
      calculateLinks(particles) {
        this.links = [];
        for (const otherParticle of particles) {
          if (this === otherParticle) continue;
          
          const dx = this.x - otherParticle.x;
          const dy = this.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.distance) {
            const opacity = 1 - distance / this.distance;
            this.links.push({
              x: otherParticle.x,
              y: otherParticle.y,
              opacity: opacity * 0.25,
              distance: distance
            });
          }
        }
      }

      // Draw connections to nearby particles
      drawLinks() {
        for (const link of this.links) {
          // Thinner lines for distant particles
          const lineWidth = 0.5 - (link.distance / this.distance * 0.4);
          
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(link.x, link.y);
          ctx.strokeStyle = `rgba(255,255,255,${link.opacity})`;
          ctx.lineWidth = Math.max(0.1, lineWidth);
          ctx.stroke();
        }
      }
    }

    function init() {
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push(new Particle(x, y));
      }
    }

    function animate() {
      // Clear with semi-transparent black to create subtle trail effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      // Process all particles
      for (const particle of particles) {
        particle.update();
        particle.calculateLinks(particles);
      }
      
      // Draw connections first (so they appear behind particles)
      for (const particle of particles) {
        particle.drawLinks();
      }
      
      // Draw particles on top
      for (const particle of particles) {
        particle.draw();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    }

    // Initialize and start animation
    init();
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
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
        pointerEvents: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: '#111827' }} // using a dark gray/black color to match Footer
      />
    </div>
  );
};

export default VenomBeam;
