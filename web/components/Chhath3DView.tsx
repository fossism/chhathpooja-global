"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Chhath3DView({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeMode, setTimeMode] = useState<"dawn" | "dusk">("dawn");
  const [elapsed, setElapsed] = useState(0);
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "video">("3d");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Three.js internal references
  const animFrameRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Check if a 15-second pre-rendered video is available in /videos/
  useEffect(() => {
    fetch("/videos/chhath-3d-15s.mp4", { method: "HEAD" })
      .then((res) => {
        if (res.ok) setIsVideoAvailable(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth > 0 ? container.clientWidth : 800;
    const height = container.clientHeight > 0 ? container.clientHeight : 460;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Warm atmospheric colors
    const dawnSky = new THREE.Color(0xff8c42); // Warm Saffron Dawn
    const duskSky = new THREE.Color(0xd94e34); // Crimson Sunset
    scene.background = timeMode === "dawn" ? dawnSky : duskSky;
    scene.fog = new THREE.FogExp2(timeMode === "dawn" ? 0xffaa5e : 0xe66042, 0.035);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(0, 3, 14);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous canvas
    container.innerHTML = "";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.7);
    scene.add(ambientLight);

    // Sun directional light
    const sunLight = new THREE.DirectionalLight(0xfff1cf, 2.2);
    sunLight.position.set(0, 4, -18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 1. THE 3D RISING SUN (Surya Dev)
    const sunGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffe680 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(0, 3.8, -22);
    scene.add(sunMesh);

    // Sun outer aura
    const auraGeo = new THREE.SphereGeometry(3.6, 24, 24);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.copy(sunMesh.position);
    scene.add(auraMesh);

    // 2. THE 3D STEPPED GHAT (Terracotta & Sandstone River Stairs)
    const ghatGroup = new THREE.Group();
    const stepCount = 9;
    const stepWidth = 28;
    const stepDepth = 1.2;
    const stepHeight = 0.55;

    const ghatMaterial = new THREE.MeshStandardMaterial({
      color: 0xa85832, // Terracotta brick
      roughness: 0.85,
      metalness: 0.1
    });

    const ghatEdgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd49b6a, // Sandstone border
      roughness: 0.7
    });

    for (let i = 0; i < stepCount; i++) {
      const stepGeo = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
      const stepMesh = new THREE.Mesh(stepGeo, ghatMaterial);
      stepMesh.position.set(0, i * stepHeight, (stepCount - i) * stepDepth - 2);
      stepMesh.receiveShadow = true;
      ghatGroup.add(stepMesh);

      // Sandstone edge accent
      const edgeGeo = new THREE.BoxGeometry(stepWidth, 0.08, 0.18);
      const edgeMesh = new THREE.Mesh(edgeGeo, ghatEdgeMaterial);
      edgeMesh.position.set(0, i * stepHeight + stepHeight / 2 + 0.04, (stepCount - i) * stepDepth - stepDepth / 2 - 2);
      ghatGroup.add(edgeMesh);
    }
    scene.add(ghatGroup);

    // 3. 3D SUGARCANE KOSI PYRAMID (Iconic Chhath Element)
    const kosiGroup = new THREE.Group();
    const caneMat = new THREE.MeshStandardMaterial({ color: 0x477023, roughness: 0.5 }); // Sugarcane green
    const caneLeafMat = new THREE.MeshStandardMaterial({ color: 0x649931, roughness: 0.4 });

    // 4 leaning canes meeting at the top
    const caneAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    caneAngles.forEach((angle) => {
      const caneGeo = new THREE.CylinderGeometry(0.06, 0.09, 4.5, 8);
      const cane = new THREE.Mesh(caneGeo, caneMat);
      const radius = 1.2;
      cane.position.set(Math.cos(angle) * radius, 2.2, Math.sin(angle) * radius);
      cane.rotation.x = -Math.sin(angle) * 0.28;
      cane.rotation.z = Math.cos(angle) * 0.28;
      kosiGroup.add(cane);

      // Top leaves
      const leafGeo = new THREE.ConeGeometry(0.3, 1.2, 4);
      const leaf = new THREE.Mesh(leafGeo, caneLeafMat);
      leaf.position.set(0, 4.4, 0);
      leaf.rotation.y = angle;
      kosiGroup.add(leaf);
    });

    // Mitti ka Kalsi (earthen pot with lamp under Kosi)
    const potGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0x8a391b, roughness: 0.9 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(0, 0.45, 0);
    kosiGroup.add(pot);

    // Glowing Kosi Diya light
    const kosiLight = new THREE.PointLight(0xffaa22, 2.0, 5);
    kosiLight.position.set(0, 1.1, 0);
    kosiGroup.add(kosiLight);

    kosiGroup.position.set(-4.5, 3.2, 3);
    scene.add(kosiGroup);

    // Second Kosi on right side
    const kosiGroup2 = kosiGroup.clone();
    kosiGroup2.position.set(4.5, 3.2, 3);
    scene.add(kosiGroup2);

    // 4. ANIMATED 3D RIVER WATER (Sacred Ganga)
    const waterWidth = 40;
    const waterDepth = 35;
    const waterSegs = 48;
    const waterGeo = new THREE.PlaneGeometry(waterWidth, waterDepth, waterSegs, waterSegs);
    waterGeo.rotateX(-Math.PI / 2);

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x124d54, // River teal
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
      flatShading: true
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, 0.15, -4);
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);

    // Keep vertex originals for wave animation
    const posAttr = waterGeo.attributes.position;
    const originalY: number[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      originalY.push(posAttr.getY(i));
    }

    // 5. FLOATING 3D EARTHEN DIYAS (Mitti ke diye with flame glow)
    const diyas: { mesh: THREE.Group; light: THREE.PointLight; speed: number; basePos: THREE.Vector3 }[] = [];
    const diyaCount = 14;

    for (let i = 0; i < diyaCount; i++) {
      const diyaGroup = new THREE.Group();

      // Clay bowl
      const bowlGeo = new THREE.CylinderGeometry(0.2, 0.1, 0.09, 12);
      const bowlMat = new THREE.MeshStandardMaterial({ color: 0x8a381a, roughness: 0.95 });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      diyaGroup.add(bowl);

      // Yellow-orange flame
      const flameGeo = new THREE.ConeGeometry(0.06, 0.16, 8);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(0, 0.1, 0);
      diyaGroup.add(flame);

      // Flickering Diya point light
      const diyaLight = new THREE.PointLight(0xff9900, 1.2, 2.5);
      diyaLight.position.set(0, 0.2, 0);
      diyaGroup.add(diyaLight);

      // Initial position distributed on the water
      const startX = (Math.random() - 0.5) * 16;
      const startZ = -12 + Math.random() * 14;
      diyaGroup.position.set(startX, 0.2, startZ);

      scene.add(diyaGroup);
      diyas.push({
        mesh: diyaGroup,
        light: diyaLight,
        speed: 0.3 + Math.random() * 0.4,
        basePos: new THREE.Vector3(startX, 0.2, startZ)
      });
    }

    // 6. RED & ORANGE CHHATHI MAIYA FLAGS (Dhwaja)
    const flagGeo = new THREE.ConeGeometry(0.5, 1.0, 3);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xe63919, roughness: 0.6 });
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28 });

    [-8, -2, 2, 8].forEach((x, idx) => {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(x, 5.5, 7.5);
      scene.add(pole);

      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(x + 0.3, 7.0, 7.5);
      flag.rotation.z = -Math.PI / 2;
      scene.add(flag);
    });

    // 7. USER MOUSE / TOUCH INTERACTION (Orbit preview)
    let isDragging = false;
    let prevMouseX = 0;
    let manualYaw = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      manualYaw += deltaX * 0.005;
      prevMouseX = e.clientX;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Handle Resize with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener("resize", handleResize);

    // 8. 15-SECOND CINEMATIC ANIMATION LOOP
    const loopDuration = 15; // exactly 15 seconds
    const startTime = performance.now();

    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const timeSec = (now - startTime) / 1000;
      const currentLoopSec = timeSec % loopDuration;
      setElapsed(Number(currentLoopSec.toFixed(1)));

      // 15s Cinematic Camera choreography:
      // 0 - 5s: Smooth low drift across the river diyas towards the ghat
      // 5 - 10s: Rising pedestal shot viewing the kosi and holy stepped stairs
      // 10 - 15s: Sweeping orbit centering onto the golden sun horizon
      const progress = currentLoopSec / loopDuration; // 0.0 to 1.0

      if (!isDragging) {
        // Parametric cinematic orbit path
        const angle = progress * Math.PI * 0.7 - Math.PI * 0.35 + manualYaw;
        const camDistance = 15 - Math.sin(progress * Math.PI) * 3;
        const camHeight = 3.2 + Math.sin(progress * Math.PI) * 2.5;

        camera.position.x = Math.sin(angle) * camDistance;
        camera.position.z = Math.cos(angle) * camDistance;
        camera.position.y = camHeight;

        // Focus point: transitions smoothly towards the holy sun
        const targetZ = -4 - Math.sin(progress * Math.PI) * 6;
        camera.lookAt(0, 2.0, targetZ);
      }

      // Animate water waves
      for (let i = 0; i < posAttr.count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getZ(i);
        const wave =
          Math.sin(u * 0.8 + timeSec * 1.8) * 0.12 +
          Math.cos(v * 0.6 + timeSec * 1.4) * 0.09;
        posAttr.setY(i, originalY[i] + wave);
      }
      posAttr.needsUpdate = true;

      // Animate floating diyas
      diyas.forEach((d, idx) => {
        const flicker = 0.9 + Math.sin(timeSec * 8 + idx) * 0.3;
        d.light.intensity = flicker;

        // Gentle drift and bobbing on water
        d.mesh.position.y = 0.18 + Math.sin(timeSec * 2 + idx) * 0.06;
        d.mesh.position.x = d.basePos.x + Math.sin(timeSec * d.speed + idx) * 0.6;
        d.mesh.position.z = d.basePos.z + Math.cos(timeSec * d.speed * 0.5 + idx) * 0.4;
      });

      // Subtle sun breathing aura
      const auraScale = 1.0 + Math.sin(timeSec * 2.5) * 0.08;
      auraMesh.scale.set(auraScale, auraScale, auraScale);

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // CLEANUP
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [timeMode]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-teal shadow-2xl text-cream ${className}`}>
      {/* Top Header / Mode Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-cream/15 bg-black/35 backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mustard" />
          </span>
          <span className="text-xs uppercase tracking-widest font-mono text-mustard font-bold">
            15s 3D Ghat View
          </span>
          <span className="text-cream/40 text-xs hidden sm:inline">|</span>
          <span className="text-xs text-cream/80 hidden sm:inline">
            Interactive WebGL &bull; Just like Jantar Mantar 3D
          </span>
        </div>

        {/* View Mode & Lighting Toggle */}
        <div className="flex items-center gap-2">
          {/* Dawn / Dusk Switch */}
          <button
            onClick={() => setTimeMode(timeMode === "dawn" ? "dusk" : "dawn")}
            className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5"
            title="Toggle between Sunrise (Usha) and Sunset (Sandhya)"
          >
            {timeMode === "dawn" ? (
              <>
                <span>🌅</span>
                <span className="text-mustard">Usha Arghya (Dawn)</span>
              </>
            ) : (
              <>
                <span>🌇</span>
                <span className="text-orange-300">Sandhya Arghya (Sunset)</span>
              </>
            )}
          </button>

          {/* Video Toggle (If an mp4 video is provided) */}
          {isVideoAvailable && (
            <button
              onClick={() => setViewMode(viewMode === "3d" ? "video" : "3d")}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-mustard text-teal transition font-bold"
            >
              {viewMode === "3d" ? "▶ Play 15s Video" : "🎮 Interactive 3D"}
            </button>
          )}
        </div>
      </div>

      {/* 15-Second Cinematic Progress Bar */}
      <div className="w-full h-1.5 bg-black/40 relative z-20">
        <div
          className="h-full bg-mustard transition-all duration-100 ease-linear"
          style={{ width: `${(elapsed / 15) * 100}%` }}
        />
      </div>

      {/* Main 3D Canvas / Video Container */}
      <div className="relative h-[360px] sm:h-[420px] md:h-[480px] w-full overflow-hidden bg-black/60 flex items-center justify-center">
        {viewMode === "3d" ? (
          <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none" />
        ) : (
          <video
            ref={videoRef}
            src="/videos/chhath-3d-15s.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Cinematic Watermark / Narrative Overlay */}
        <div className="absolute bottom-4 left-4 sm:left-6 z-20 pointer-events-none max-w-lg">
          <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
            <p className="text-xs sm:text-sm font-extrabold text-cream leading-tight">
              {timeMode === "dawn" ? "उषा अर्घ्य — उगते सूर्य को नमन" : "संध्या अर्घ्य — अस्ताचलगामी सूर्य को अर्घ्य"}
            </p>
            <p className="text-[11px] text-mustard/90 mt-0.5">
              3D Cinematic View: River Ganga, Floating Diyas, Sugarcane Kosi & Holy Sun
            </p>
          </div>
        </div>

        {/* Drag Hint */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:block">
          <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-cream/75 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Click &amp; drag to rotate 3D view
          </span>
        </div>
      </div>

      {/* Bottom Bar: 15-second loop counter and controls */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-black/40 border-t border-cream/15 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-mustard font-bold text-[11px]">
            00:{Math.floor(elapsed).toString().padStart(2, "0")} / 00:15
          </span>
          <span className="text-cream/50 text-[11px] hidden sm:inline">
            15s continuous camera orbit loop
          </span>
        </div>

        <div className="text-[11px] text-cream/70 font-mono">
          Surya Mandir &bull; Ganga Ghat &bull; Kosi Parikrama
        </div>
      </div>
    </div>
  );
}
