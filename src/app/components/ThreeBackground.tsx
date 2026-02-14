import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  isDark: boolean;
}

export function ThreeBackground({ isDark }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const tubesRef = useRef<THREE.Mesh[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create animated tubes
    const numTubes = 20;
    const tubes: THREE.Mesh[] = [];

    for (let i = 0; i < numTubes; i++) {
      // Create curved path
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ),
      ]);

      const geometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
      
      // Random accent color
      const colors = [0xf967fb, 0x53bc28, 0x6958d5];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3,
      });

      const tube = new THREE.Mesh(geometry, material);
      
      // Random rotation
      tube.rotation.x = Math.random() * Math.PI;
      tube.rotation.y = Math.random() * Math.PI;
      
      scene.add(tube);
      tubes.push(tube);
    }

    tubesRef.current = tubes;

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth mouse follow
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      // Animate tubes
      tubes.forEach((tube, index) => {
        tube.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
        tube.rotation.y += 0.002 * (index % 2 === 0 ? -1 : 1);
        
        // React to mouse
        tube.position.x += mouseRef.current.x * 0.01;
        tube.position.y += mouseRef.current.y * 0.01;
      });

      // Camera movement based on mouse
      camera.position.x = mouseRef.current.x * 0.5;
      camera.position.y = mouseRef.current.y * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      tubes.forEach(tube => {
        tube.geometry.dispose();
        (tube.material as THREE.Material).dispose();
      });
      
      renderer.dispose();
    };
  }, []);

  // Update tube opacity based on theme
  useEffect(() => {
    tubesRef.current.forEach(tube => {
      const material = tube.material as THREE.MeshBasicMaterial;
      material.opacity = isDark ? 0.4 : 0.2;
    });
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ 
        background: isDark 
          ? 'linear-gradient(135deg, #191919 0%, #252525 100%)'
          : 'linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%)'
      }}
    />
  );
}
