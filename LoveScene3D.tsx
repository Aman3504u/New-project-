import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import lizaPhoto from '@/assets/liza-photo.png';

const LoveScene3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff1493, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Create starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
      starsPositions[i] = (Math.random() - 0.5) * 200;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Text elements array
    const textElements: THREE.Mesh[] = [];
    const photoElements: THREE.Mesh[] = [];
    const heartElements: THREE.Mesh[] = [];

    // Create 3D text planes with canvas textures
    const createTextTexture = (text: string, color: string, size: number = 64) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 512;
      canvas.height = 256;
      
      context.fillStyle = 'transparent';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = `bold ${size}px Arial`;
      context.fillStyle = color;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Add glow effect
      context.shadowColor = color;
      context.shadowBlur = 20;
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Create text meshes - "hey Lisa" only
    const textMessages = [
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa',
      'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa', 'hey Lisa'
    ];
    
    textMessages.forEach((text, index) => {
      const colors = ['#ff1493', '#da70d6', '#ff69b4', '#ba55d3', '#9932cc'];
      const color = colors[index % colors.length];
      const size = 30 + Math.random() * 40; // Varied text sizes
      const texture = createTextTexture(text, color, size);
      
      const width = 6 + Math.random() * 8;
      const height = 3 + Math.random() * 4;
      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const textMesh = new THREE.Mesh(geometry, material);
      // Position text behind images, more static like reference
      textMesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60,
        -10 - Math.random() * 30  // Behind the photos
      );
      textMesh.rotation.set(
        Math.random() * 0.2,
        Math.random() * 0.4,
        Math.random() * 0.2
      );
      
      scene.add(textMesh);
      textElements.push(textMesh);
    });

    // Create many more photo elements spread throughout
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(lizaPhoto, (texture) => {
      for (let i = 0; i < 25; i++) { // Much more photos
        const size = 4 + Math.random() * 6; // Varied sizes
        const geometry = new THREE.PlaneGeometry(size, size * 1.2);
        const material = new THREE.MeshBasicMaterial({ 
          map: texture, 
          transparent: true,
          side: THREE.DoubleSide
        });
        
        const photoMesh = new THREE.Mesh(geometry, material);
        photoMesh.position.set(
          (Math.random() - 0.5) * 70,
          (Math.random() - 0.5) * 50,
          Math.random() * 20  // In front of text
        );
        photoMesh.rotation.set(
          Math.random() * 0.3,
          Math.random() * 0.6,
          Math.random() * 0.3
        );
        
        scene.add(photoMesh);
        photoElements.push(photoMesh);
      }
    });

    // Create tons of heart emojis everywhere
    for (let i = 0; i < 60; i++) { // Much more hearts
      const heartTexture = createTextTexture('❤️', '#ff0000', 60 + Math.random() * 30);
      const size = 2 + Math.random() * 3; // Varied sizes
      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.MeshBasicMaterial({ 
        map: heartTexture, 
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const heartMesh = new THREE.Mesh(geometry, material);
      heartMesh.position.set(
        (Math.random() - 0.5) * 110,
        (Math.random() - 0.5) * 75,
        (Math.random() - 0.5) * 95
      );
      
      scene.add(heartMesh);
      heartElements.push(heartMesh);
    }

    // Camera position
    camera.position.z = 30;

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        // Rotate all elements
        [...textElements, ...photoElements, ...heartElements].forEach(element => {
          element.rotation.y += deltaMove.x * 0.01;
          element.rotation.x += deltaMove.y * 0.01;
        });

        stars.rotation.y += deltaMove.x * 0.005;
        stars.rotation.x += deltaMove.y * 0.005;
      }

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.1;
      camera.position.z = Math.max(10, Math.min(80, camera.position.z));
    };

    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Minimal animation for text - no rotation
      textElements.forEach((text, index) => {
        if (!isDragging) {
          text.position.y += Math.sin(time + index) * 0.01;
        }
      });

      // Minimal animation for photos
      photoElements.forEach((photo, index) => {
        if (!isDragging) {
          photo.position.y += Math.cos(time + index * 0.5) * 0.01;
        }
      });

      // Animate hearts
      heartElements.forEach((heart, index) => {
        if (!isDragging) {
          heart.rotation.z += 0.02;
          heart.position.y += Math.sin(time * 1.5 + index * 0.3) * 0.03;
          
          // Pulsing effect
          const scale = 1 + Math.sin(time * 2 + index) * 0.2;
          heart.scale.setScalar(scale);
        }
      });

      // Animate stars
      if (!isDragging) {
        stars.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full cosmic-bg overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ 
        background: 'radial-gradient(circle at 20% 80%, rgba(68, 32, 128, 0.6) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(128, 32, 128, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(128, 32, 96, 0.3) 0%, transparent 50%), #0a0a0f'
      }}
    />
  );
};

export default LoveScene3D;