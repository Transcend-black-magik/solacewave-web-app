import React, { useEffect, useRef } from 'react';
import '../../styles/components/animated-background.css';

const AnimatedBackground = ({ variant = 'default' }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Different background animations based on variant
    switch (variant) {
      case 'subtle':
        renderSubtleBackground(canvas, ctx, animationFrameId);
        break;
      case 'pattern':
        renderPatternBackground(canvas, ctx, animationFrameId);
        break;
      case 'celebration':
        renderCelebrationBackground(canvas, ctx, animationFrameId);
        break;
      default:
        renderDefaultBackground(canvas, ctx, animationFrameId);
        break;
    }
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant]);
  
  // Default animation with gentle floating shapes
  const renderDefaultBackground = (canvas, ctx, animationFrameId) => {
    const particles = [];
    const particleCount = 20;
    const colors = ['#87431D', '#D3AB9E', '#CDDC39', '#E1F5FE', '#B3E5FC'];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 30 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.2 + 0.1,
        angle: Math.random() * 360
      });
    }
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#f5f7fa');
      gradient.addColorStop(1, '#e8f5e9');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        
        // Move particles
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Change direction slightly
        particle.angle += Math.random() * 0.1 - 0.05;
        
        // Reset if off screen
        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
  };
  
  // Subtle, more professional animation for questionnaire
  const renderSubtleBackground = (canvas, ctx, animationFrameId) => {
    const gradients = [];
    const gradientCount = 3;
    
    // Create moving gradients
    for (let i = 0; i < gradientCount; i++) {
      gradients.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 200,
        hue: 100 + Math.random() * 60, // Green to teal hues
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * 360
      });
    }
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw white base
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle gradients
      gradients.forEach(gradient => {
        const grd = ctx.createRadialGradient(
          gradient.x, gradient.y, 0,
          gradient.x, gradient.y, gradient.radius
        );
        
        grd.addColorStop(0, `hsla(${gradient.hue}, 70%, 90%, 0.3)`);
        grd.addColorStop(1, `hsla(${gradient.hue}, 70%, 90%, 0)`);
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Move gradient centers
        gradient.x += Math.cos(gradient.angle) * gradient.speed;
        gradient.y += Math.sin(gradient.angle) * gradient.speed;
        
        // Change direction slightly
        gradient.angle += Math.random() * 0.02 - 0.01;
        
        // Keep within canvas bounds with some padding
        if (gradient.x < -gradient.radius / 2) gradient.x = canvas.width + gradient.radius / 2;
        if (gradient.x > canvas.width + gradient.radius / 2) gradient.x = -gradient.radius / 2;
        if (gradient.y < -gradient.radius / 2) gradient.y = canvas.height + gradient.radius / 2;
        if (gradient.y > canvas.height + gradient.radius / 2) gradient.y = -gradient.radius / 2;
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
  };
  
  // Pattern background for account creation
  const renderPatternBackground = (canvas, ctx, animationFrameId) => {
    let patternScale = 50;
    let patternOpacity = 0.1;
    let patternOffset = 0;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#f5f8ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw pattern
      ctx.save();
      ctx.globalAlpha = patternOpacity;
      
      // Hexagon pattern
      const patternSize = patternScale;
      const halfSize = patternSize / 2;
      const rowHeight = patternSize * 0.866; // height of equilateral triangle (sqrt(3)/2)
      
      for (let y = -rowHeight + patternOffset % rowHeight; y < canvas.height + rowHeight; y += rowHeight) {
        let rowOffset = 0;
        for (let row = 0; row < 2; row++) {
          for (let x = -patternSize + (patternOffset / 2) % patternSize + rowOffset; 
               x < canvas.width + patternSize; 
               x += patternSize) {
            
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (60 * i + 30) * Math.PI / 180;
              const px = x + halfSize * Math.cos(angle);
              const py = y + halfSize * Math.sin(angle);
              if (i === 0) {
                ctx.moveTo(px, py);
              } else {
                ctx.lineTo(px, py);
              }
            }
            ctx.closePath();
            
            // Alternate colors based on position
            if ((Math.floor(x / patternSize) + Math.floor(y / rowHeight)) % 2 === 0) {
              ctx.strokeStyle = '#87431D';
            } else {
              ctx.strokeStyle = '#D3AB9E';
            }
            
            ctx.stroke();
          }
          rowOffset = patternSize / 2;
          y += rowHeight;
        }
      }
      
      ctx.restore();
      
      // Slowly animate pattern
      patternOffset += 0.05;
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
  };
  
  // Celebration animation for download app page
  const renderCelebrationBackground = (canvas, ctx, animationFrameId) => {
    const particles = [];
    const particleCount = 100;
    const colors = ['#87431D', '#D3AB9E', '#FFD54F', '#FFC107', '#FF9800'];
    
    // Create confetti particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        speedY: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        type: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#fff3ee');
      gradient.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        
        ctx.fillStyle = particle.color;
        
        if (particle.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        }
        
        ctx.restore();
        
        // Update position
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        particle.rotation += particle.rotationSpeed;
        
        // Reset if off bottom
        if (particle.y > canvas.height + particle.size) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }
        
        // Bounce off sides
        if (particle.x < -particle.size || particle.x > canvas.width + particle.size) {
          particle.speedX *= -1;
        }
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
  };
  
  return <canvas ref={canvasRef} className={`animated-background ${variant}`} />;
};

export default AnimatedBackground;