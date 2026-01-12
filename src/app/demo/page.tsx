"use client";

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrthographicCamera, Html } from "@react-three/drei";
import { useRef, useEffect, useState, useCallback, Suspense } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import Link from "next/link";

// Game state type
type GameState = "intro" | "playing" | "credits";

// Audio hook with play control and end detection
function useGameAudio(url: string, isPlaying: boolean, onEnded: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(url);
    audio.loop = false;
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [url, onEnded]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // If autoplay fails, play on first interaction
        const playOnInteraction = () => {
          audioRef.current?.play();
          document.removeEventListener("click", playOnInteraction);
          document.removeEventListener("keydown", playOnInteraction);
        };
        document.addEventListener("click", playOnInteraction);
        document.addEventListener("keydown", playOnInteraction);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const continuePlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, []);

  return { continuePlay };
}

// Movement hook
function useMovement() {
  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
  });
  const spacePressed = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === " " && !spacePressed.current) {
        spacePressed.current = true;
        setKeys((prev) => ({ ...prev, space: true }));
      }
      setKeys((prev) => ({
        ...prev,
        up: key === "w" || key === "arrowup" ? true : prev.up,
        down: key === "s" || key === "arrowdown" ? true : prev.down,
        left: key === "a" || key === "arrowleft" ? true : prev.left,
        right: key === "d" || key === "arrowright" ? true : prev.right,
      }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === " ") {
        spacePressed.current = false;
      }
      setKeys((prev) => ({
        ...prev,
        up: key === "w" || key === "arrowup" ? false : prev.up,
        down: key === "s" || key === "arrowdown" ? false : prev.down,
        left: key === "a" || key === "arrowleft" ? false : prev.left,
        right: key === "d" || key === "arrowright" ? false : prev.right,
        space: key === " " ? false : prev.space,
      }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}

// Cute character with rotation
function Character({
  position,
  rotation,
  onPier,
  onShed,
  onBoat,
  fishCount,
  isFishing,
  boatDocked,
}: {
  position: THREE.Vector3;
  rotation: number;
  onPier: boolean;
  onShed: boolean;
  onBoat: boolean;
  fishCount: number;
  isFishing: boolean;
  boatDocked: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.copy(position);
      groupRef.current.position.y +=
        Math.sin(state.clock.elapsedTime * 3) * 0.03;
      groupRef.current.rotation.y = rotation;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Status indicators */}
      {onPier && !isFishing && !onBoat && fishCount < 5 && (
        <Html position={[0, 1.8, 0]} center>
          <div className="text-2xl animate-bounce">🎣</div>
          <div className="text-white text-xs text-center mt-1 bg-black/50 px-2 py-0.5 rounded">
            SPACE
          </div>
        </Html>
      )}
      {isFishing && (
        <Html position={[0, 1.8, 0]} center>
          <div className="text-2xl animate-pulse">🎣</div>
          <div className="text-yellow-300 text-xs text-center mt-1">
            Fishing...
          </div>
        </Html>
      )}
      {fishCount > 0 && !isFishing && !onBoat && (
        <Html position={[0.5, 1.5, 0]} center>
          <div className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            🐟 {fishCount}/5
          </div>
        </Html>
      )}
      {onShed && fishCount > 0 && !onBoat && (
        <Html position={[0, 1.8, 0]} center>
          <div className="text-2xl animate-bounce">📦</div>
          <div className="text-white text-xs text-center mt-1 bg-black/50 px-2 py-0.5 rounded">
            SPACE
          </div>
        </Html>
      )}
      {onBoat && boatDocked && (
        <Html position={[0, 1.8, 0]} center>
          <div className="text-2xl animate-bounce">💰</div>
          <div className="text-white text-xs text-center mt-1 bg-green-600/80 px-2 py-0.5 rounded">
            SELL
          </div>
        </Html>
      )}

      {/* Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.25, 8, 12]} />
        <meshStandardMaterial color="#FFB347" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#FFDAB9" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.06, 0.78, 0.14]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#2D3436" />
      </mesh>
      <mesh position={[-0.06, 0.78, 0.14]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#2D3436" />
      </mesh>
      {/* Blush */}
      <mesh position={[0.12, 0.72, 0.12]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#FFB6C1" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.12, 0.72, 0.12]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#FFB6C1" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Island base
function Island() {
  return (
    <group>
      {/* Grass top */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4.2, 0.3, 6]} />
        <meshStandardMaterial color="#90B77D" />
      </mesh>
      {/* Dirt layer */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[4.2, 3.5, 0.6, 6]} />
        <meshStandardMaterial color="#C4A484" />
      </mesh>
      {/* Bottom rock */}
      <mesh position={[0, -0.8, 0]}>
        <coneGeometry args={[3.5, 0.8, 6]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
    </group>
  );
}

// Cozy shed with stored fish counter
function Shed({ storedFish }: { storedFish: number }) {
  return (
    <group position={[-1.5, 0.25, -1]}>
      {/* Stored fish counter */}
      {storedFish > 0 && (
        <Html position={[0, 1.8, 0]} center>
          <div className="bg-amber-600/90 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
            📦 {storedFish}
          </div>
        </Html>
      )}
      {/* Base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.8, 1.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.1, 0.6, 4]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.35, 0.61]}>
        <boxGeometry args={[0.35, 0.5, 0.05]} />
        <meshStandardMaterial color="#5D3A1A" />
      </mesh>
      {/* Windows with glow */}
      <mesh position={[0.45, 0.5, 0.61]}>
        <boxGeometry args={[0.25, 0.25, 0.02]} />
        <meshStandardMaterial
          color="#FFF8DC"
          emissive="#FFD700"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[-0.45, 0.5, 0.61]}>
        <boxGeometry args={[0.25, 0.25, 0.02]} />
        <meshStandardMaterial
          color="#FFF8DC"
          emissive="#FFD700"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Side window */}
      <mesh position={[0.71, 0.5, 0]}>
        <boxGeometry args={[0.02, 0.25, 0.25]} />
        <meshStandardMaterial
          color="#FFF8DC"
          emissive="#FFD700"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Warm light from shed */}
      <pointLight
        position={[0, 0.5, 0.8]}
        color="#FFD700"
        intensity={0.5}
        distance={3}
      />
    </group>
  );
}

// Palm tree component (reusable for rewards)
function PalmTree({ position }: { position: [number, number, number] }) {
  const leavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 8]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      {/* Trunk segments */}
      {[0.2, 0.5, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y + 0.1, 0]}>
          <torusGeometry args={[0.14, 0.03, 8, 12]} />
          <meshStandardMaterial color="#6B5344" />
        </mesh>
      ))}
      {/* Leaves */}
      <group ref={leavesRef} position={[0, 1.3, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 3) * 0.3,
              0,
              Math.sin((i * Math.PI) / 3) * 0.3,
            ]}
            rotation={[0.8, (i * Math.PI) / 3, 0]}
            castShadow
          >
            <coneGeometry args={[0.15, 0.8, 4]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        ))}
        {/* Coconuts */}
        <mesh position={[0.1, -0.1, 0.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-0.08, -0.08, -0.08]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    </group>
  );
}

// Pavement with decorations
function Pavement() {
  return (
    <group>
      {/* Stone path from shed to pier */}
      {[
        [-0.8, 0.26, 0.2],
        [-0.3, 0.26, 0.5],
        [0.2, 0.26, 0.8],
        [0.7, 0.26, 1.1],
        [1.2, 0.26, 1.3],
        [1.6, 0.26, 1.5],
      ].map((pos, i) => (
        <mesh
          key={`stone-${i}`}
          position={pos as [number, number, number]}
          receiveShadow
        >
          <cylinderGeometry
            args={[
              0.25 + Math.random() * 0.1,
              0.25 + Math.random() * 0.1,
              0.05,
              8,
            ]}
          />
          <meshStandardMaterial color="#A0A0A0" roughness={0.9} />
        </mesh>
      ))}

      {/* Fences along the path */}
      {[
        { pos: [-0.5, 0.35, -0.2], rot: 0.3 },
        { pos: [0.3, 0.35, 0.3], rot: 0.5 },
        { pos: [1.0, 0.35, 0.7], rot: 0.6 },
      ].map((fence, i) => (
        <group
          key={`fence-${i}`}
          position={fence.pos as [number, number, number]}
          rotation={[0, fence.rot, 0]}
        >
          {/* Posts */}
          <mesh position={[-0.2, 0.15, 0]} castShadow>
            <boxGeometry args={[0.06, 0.35, 0.06]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          <mesh position={[0.2, 0.15, 0]} castShadow>
            <boxGeometry args={[0.06, 0.35, 0.06]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          {/* Rails */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[0.5, 0.04, 0.04]} />
            <meshStandardMaterial color="#A0522D" />
          </mesh>
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.5, 0.04, 0.04]} />
            <meshStandardMaterial color="#A0522D" />
          </mesh>
        </group>
      ))}

      {/* Flowers along the path */}
      {[
        { pos: [-1.0, 0.28, 0.5], color: "#FF6B9D" },
        { pos: [-0.6, 0.28, 0.8], color: "#FFE66D" },
        { pos: [0.0, 0.28, 1.1], color: "#FF6B9D" },
        { pos: [0.5, 0.28, 0.4], color: "#9B59B6" },
        { pos: [0.9, 0.28, 1.4], color: "#FFE66D" },
        { pos: [-0.2, 0.28, -0.1], color: "#FF6B9D" },
        { pos: [1.3, 0.28, 0.9], color: "#9B59B6" },
      ].map((flower, i) => (
        <group
          key={`flower-${i}`}
          position={flower.pos as [number, number, number]}
        >
          {/* Stem */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.16, 6]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
          {/* Flower head */}
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={flower.color} />
          </mesh>
        </group>
      ))}

      {/* Small bushes */}
      {[
        [-1.3, 0.32, 0.0],
        [0.6, 0.32, 0.0],
        [1.5, 0.32, 0.8],
      ].map((pos, i) => (
        <mesh
          key={`bush-${i}`}
          position={pos as [number, number, number]}
          castShadow
        >
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#2E7D32" />
        </mesh>
      ))}
    </group>
  );
}

// Pier
function Pier() {
  return (
    <group position={[2, 0, 1.5]}>
      {/* Main platform */}
      <mesh position={[0.8, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 0.8]} />
        <meshStandardMaterial color="#DEB887" />
      </mesh>
      {/* Planks detail */}
      {[-0.3, 0, 0.3].map((z, i) => (
        <mesh key={i} position={[0.8, 0.21, z]}>
          <boxGeometry args={[2, 0.02, 0.2]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
      ))}
      {/* Support posts */}
      {[
        [0.2, 0.3],
        [0.2, -0.3],
        [1.5, 0.3],
        [1.5, -0.3],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.2, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
      ))}
    </group>
  );
}

// Bubble particle for boat wake
function Bubble({
  position,
  delay,
}: {
  position: [number, number, number];
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(0);

  useFrame((state) => {
    if (meshRef.current) {
      if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - startTime.current - delay;

      if (elapsed > 0 && elapsed < 2) {
        meshRef.current.visible = true;
        meshRef.current.position.y = position[1] + elapsed * 0.3;
        meshRef.current.scale.setScalar(1 - elapsed * 0.4);
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.opacity = 0.6 - elapsed * 0.3;
      } else if (elapsed >= 2) {
        startTime.current = state.clock.elapsedTime;
      } else {
        meshRef.current.visible = false;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} visible={false}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
    </mesh>
  );
}

// Boat that arrives periodically with animation
function Boat({
  boatState,
  dockPosition,
}: {
  boatState: "arriving" | "docked" | "leaving" | "gone";
  dockPosition: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef({ x: 15, z: 10 }); // Start off-screen bottom-right
  const isMoving = boatState === "arriving" || boatState === "leaving";

  // Off-screen position (bottom-right in isometric view)
  const offScreenPos = { x: 15, z: 10 };

  useFrame((state) => {
    if (!groupRef.current) return;

    // Target position based on state
    let targetX = offScreenPos.x;
    let targetZ = offScreenPos.z;

    if (boatState === "arriving" || boatState === "docked") {
      targetX = dockPosition[0];
      targetZ = dockPosition[2];
    } else {
      targetX = offScreenPos.x;
      targetZ = offScreenPos.z;
    }

    // Smooth movement
    currentPos.current.x = THREE.MathUtils.lerp(
      currentPos.current.x,
      targetX,
      0.025
    );
    currentPos.current.z = THREE.MathUtils.lerp(
      currentPos.current.z,
      targetZ,
      0.025
    );

    groupRef.current.position.x = currentPos.current.x;
    groupRef.current.position.z = currentPos.current.z;

    // Bobbing animation
    groupRef.current.position.y =
      dockPosition[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;

    // Boat faces the direction of travel (towards dock or away)
    const angle = boatState === "leaving" ? Math.PI * 0.75 : -Math.PI * 0.25;
    groupRef.current.rotation.y = angle;
    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
  });

  // Hide when far off-screen
  const distFromDock = Math.sqrt(
    Math.pow(currentPos.current.x - dockPosition[0], 2) +
      Math.pow(currentPos.current.z - dockPosition[2], 2)
  );
  if (boatState === "gone" && distFromDock > 12) return null;

  return (
    <group
      ref={groupRef}
      position={[currentPos.current.x, dockPosition[1], currentPos.current.z]}
      rotation={[0, -Math.PI * 0.25, 0]}
    >
      {/* Hull */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.3, 0.6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Hull bottom curve */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[1.0, 0.15, 0.5]} />
        <meshStandardMaterial color="#6B3410" />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      {/* Window */}
      <mesh position={[-0.2, 0.35, 0.21]}>
        <boxGeometry args={[0.2, 0.15, 0.02]} />
        <meshStandardMaterial
          color="#87CEEB"
          emissive="#87CEEB"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Mast */}
      <mesh position={[0.2, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#5D3A1A" />
      </mesh>
      {/* Flag */}
      <mesh position={[0.2, 0.85, 0.1]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial color="#FF6B6B" side={THREE.DoubleSide} />
      </mesh>
      {/* Wake bubbles when moving */}
      {isMoving && (
        <group position={[0.6, -0.1, 0.4]}>
          {[0, 0.3, 0.6, 0.9, 1.2].map((delay, i) => (
            <Bubble
              key={i}
              position={[Math.random() * 0.3, 0, Math.random() * 0.3]}
              delay={delay}
            />
          ))}
        </group>
      )}
    </group>
  );
}

// Swimming fish
function Fish({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = index * 2.1;

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * 0.5 + offset;
      const radius = 2 + index * 0.3;
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius * 0.6;
      meshRef.current.position.y = -0.3 + Math.sin(t * 2) * 0.05;
      meshRef.current.rotation.y = -t + Math.PI / 2;
    }
  });

  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181"];

  return (
    <mesh ref={meshRef}>
      <capsuleGeometry args={[0.05, 0.1, 4, 8]} />
      <meshStandardMaterial color={colors[index % colors.length]} />
    </mesh>
  );
}

// Colorful Ocean with gradient effect
function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);
  const deepRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      // Subtle color shift
      const hue = 0.55 + Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
      material.color.setHSL(hue, 0.6, 0.55);
    }
  });

  return (
    <group>
      {/* Deep ocean with gradient - darker at edges */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#0D3B66" />
      </mesh>
      {/* Mid ocean layer - adds depth */}
      <mesh ref={deepRef} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#1B4F72" transparent opacity={0.9} />
      </mesh>
      {/* Water surface - vibrant turquoise */}
      <mesh
        ref={meshRef}
        position={[0, -0.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#20B2AA"
          transparent
          opacity={0.8}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      {/* Shallow water ring around island - lighter color */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 8, 32]} />
        <meshStandardMaterial color="#48D1CC" transparent opacity={0.6} />
      </mesh>
      {/* Coral accents */}
      {[
        { pos: [4, -0.3, 3], color: "#FF6B6B" },
        { pos: [-3, -0.3, 4], color: "#FF8C42" },
        { pos: [5, -0.3, -2], color: "#E056FD" },
        { pos: [-4, -0.3, -3], color: "#00CED1" },
      ].map((coral, i) => (
        <mesh key={i} position={coral.pos as [number, number, number]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial
            color={coral.color}
            emissive={coral.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      {/* Swimming fish near island */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Fish key={i} index={i} />
      ))}
    </group>
  );
}

// Shed collision box bounds
const SHED_BOUNDS = {
  minX: -2.3,
  maxX: -0.7,
  minZ: -1.7,
  maxZ: -0.3,
};

// Game controller
function GameController({
  onFishCaught,
  onFishStored,
  onSellFish,
  fishCount,
  storedFish,
  boatDocked,
  treePositions,
}: {
  onFishCaught: () => void;
  onFishStored: () => void;
  onSellFish: () => void;
  fishCount: number;
  storedFish: number;
  boatDocked: boolean;
  treePositions: [number, number, number][];
}) {
  const keys = useMovement();
  const playerPos = useRef(new THREE.Vector3(0, 0.25, 0));
  const playerRotation = useRef(0);
  const [onPier, setOnPier] = useState(false);
  const [onShed, setOnShed] = useState(false);
  const [onBoat, setOnBoat] = useState(false);
  const [isFishing, setIsFishing] = useState(false);
  const fishingTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSpaceState = useRef(false);

  // Handle space press
  useEffect(() => {
    if (keys.space && !lastSpaceState.current) {
      if (onBoat && boatDocked && (fishCount > 0 || storedFish > 0)) {
        onSellFish();
      } else if (onPier && !isFishing && fishCount < 5 && !onBoat) {
        setIsFishing(true);
      } else if (onShed && fishCount > 0 && !onBoat) {
        onFishStored();
      }
    }
    lastSpaceState.current = keys.space;
  }, [
    keys.space,
    onPier,
    onShed,
    onBoat,
    isFishing,
    fishCount,
    storedFish,
    boatDocked,
    onFishStored,
    onSellFish,
  ]);

  // Fishing timer (4.5 seconds)
  useEffect(() => {
    if (isFishing && fishCount < 5) {
      fishingTimer.current = setInterval(() => {
        onFishCaught();
      }, 4500);
    }
    return () => {
      if (fishingTimer.current) {
        clearInterval(fishingTimer.current);
      }
    };
  }, [isFishing, onFishCaught, fishCount]);

  // Stop fishing if max fish or leave pier
  useEffect(() => {
    if (fishCount >= 5 || !onPier) {
      setIsFishing(false);
      if (fishingTimer.current) {
        clearInterval(fishingTimer.current);
      }
    }
  }, [fishCount, onPier]);

  useFrame(() => {
    const speed = 0.05;
    const direction = new THREE.Vector3();

    // Isometric movement
    if (keys.up) {
      direction.x -= 1;
      direction.z -= 1;
    }
    if (keys.down) {
      direction.x += 1;
      direction.z += 1;
    }
    if (keys.left) {
      direction.x -= 1;
      direction.z += 1;
    }
    if (keys.right) {
      direction.x += 1;
      direction.z -= 1;
    }

    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(speed);
      const newPos = playerPos.current.clone().add(direction);

      // Update rotation to face movement direction
      playerRotation.current = Math.atan2(direction.x, direction.z);

      // Boundary check (stay on island + pier)
      const distFromCenter = Math.sqrt(
        newPos.x * newPos.x + newPos.z * newPos.z
      );
      const onPierArea =
        newPos.x > 1.5 && newPos.x < 4.5 && newPos.z > 0.8 && newPos.z < 2.4;

      // Check shed collision
      const inShedBounds =
        newPos.x > SHED_BOUNDS.minX &&
        newPos.x < SHED_BOUNDS.maxX &&
        newPos.z > SHED_BOUNDS.minZ &&
        newPos.z < SHED_BOUNDS.maxZ;

      if ((distFromCenter < 3.5 || onPierArea) && !inShedBounds) {
        playerPos.current.copy(newPos);
      }
    }

    // Check if on pier (fishing area)
    const pierCheck =
      playerPos.current.x > 2.5 &&
      playerPos.current.x < 4 &&
      playerPos.current.z > 1 &&
      playerPos.current.z < 2.2;
    setOnPier(pierCheck);

    // Check if near boat (end of pier)
    const boatCheck =
      playerPos.current.x > 3.5 &&
      playerPos.current.z > 1 &&
      playerPos.current.z < 2.2;
    setOnBoat(boatCheck);

    // Check if near shed (front of shed, not inside)
    const shedDist = playerPos.current.distanceTo(
      new THREE.Vector3(-1.5, 0.25, 0.3)
    );
    setOnShed(shedDist < 0.8);
  });

  return (
    <>
      <Character
        position={playerPos.current}
        rotation={playerRotation.current}
        onPier={onPier}
        onShed={onShed}
        onBoat={onBoat}
        fishCount={fishCount}
        isFishing={isFishing}
        boatDocked={boatDocked}
      />
      {/* Reward trees */}
      {treePositions.map((pos, i) => (
        <PalmTree key={`reward-tree-${i}`} position={pos} />
      ))}
    </>
  );
}

// Lighting
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#FFF5E6" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.9}
        color="#FFE4C4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-3, 3, -3]} intensity={0.3} color="#FFB347" />
      {/* Horizon glow */}
      <hemisphereLight args={["#87CEEB", "#2E86AB", 0.3]} />
    </>
  );
}

// Low-poly Flower (Daisy)
function LowPolyDaisy({ position }: { position: [number, number, number] }) {
  const obj = useLoader(OBJLoader, "/obj/Daisy/Daisy.obj");
  const clonedObj = obj.clone();

  useEffect(() => {
    clonedObj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: "#FFFFFF",
          emissive: "#FFD700",
          emissiveIntensity: 0.2,
        });
      }
    });
  }, [clonedObj]);

  return (
    <primitive
      object={clonedObj}
      position={position}
      scale={[0.15, 0.15, 0.15]}
    />
  );
}

// Low-poly Tulip
function LowPolyTulip({
  position,
  color = "#E91E63",
}: {
  position: [number, number, number];
  color?: string;
}) {
  const obj = useLoader(OBJLoader, "/obj/tulip 3/model.obj");
  const clonedObj = obj.clone();

  useEffect(() => {
    clonedObj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.6,
        });
      }
    });
  }, [clonedObj, color]);

  return (
    <primitive
      object={clonedObj}
      position={position}
      scale={[0.2, 0.2, 0.2]}
      rotation={[0, Math.random() * Math.PI * 2, 0]}
    />
  );
}

// Low-poly Bell Flower
function LowPolyBellFlower({
  position,
}: {
  position: [number, number, number];
}) {
  const obj = useLoader(OBJLoader, "/obj/Bell Flower/Bell_flower.obj");
  const clonedObj = obj.clone();

  useEffect(() => {
    clonedObj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: "#9C27B0",
          emissive: "#9C27B0",
          emissiveIntensity: 0.2,
        });
      }
    });
  }, [clonedObj]);

  return (
    <primitive
      object={clonedObj}
      position={position}
      scale={[0.15, 0.15, 0.15]}
    />
  );
}

// Isometric camera
function IsometricCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

// Scene
function Scene({
  onFishCaught,
  onFishStored,
  onSellFish,
  fishCount,
  storedFish,
  boatState,
  treePositions,
}: {
  onFishCaught: () => void;
  onFishStored: () => void;
  onSellFish: () => void;
  fishCount: number;
  storedFish: number;
  boatState: "arriving" | "docked" | "leaving" | "gone";
  treePositions: [number, number, number][];
}) {
  return (
    <>
      <OrthographicCamera
        makeDefault
        zoom={70}
        position={[8, 6, 8]}
        near={0.1}
        far={200}
      />
      <IsometricCamera />
      <Lighting />
      <Ocean />
      <Island />
      <Shed storedFish={storedFish} />
      <PalmTree position={[1.5, 0.25, -1.5]} />
      <Pavement />
      <Pier />
      <Boat boatState={boatState} dockPosition={[4.5, 0, 1.5]} />
      <GameController
        onFishCaught={onFishCaught}
        onFishStored={onFishStored}
        onSellFish={onSellFish}
        fishCount={fishCount}
        storedFish={storedFish}
        boatDocked={boatState === "docked"}
        treePositions={treePositions}
      />

      {/* Low-poly models from /obj directory */}
      <Suspense fallback={null}>
        {/* Decorative flowers around the island - increased scales */}
        <LowPolyDaisy position={[0.8, 0.28, 0.4]} />
        <LowPolyDaisy position={[-0.5, 0.28, 1.2]} />
        <LowPolyTulip position={[1.2, 0.28, -0.3]} color="#E91E63" />
        <LowPolyTulip position={[-1.8, 0.28, 0.8]} color="#FF5722" />
        <LowPolyTulip position={[0.3, 0.28, -1.8]} color="#9C27B0" />
        <LowPolyBellFlower position={[-0.8, 0.28, -1.2]} />
        <LowPolyBellFlower position={[1.8, 0.28, 0.2]} />
      </Suspense>

      {/* Sky gradient */}
      <color attach="background" args={["#87CEEB"]} />
      <fog attach="fog" args={["#87CEEB", 20, 60]} />
    </>
  );
}

export default function DemoPage() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [fishCount, setFishCount] = useState(0);
  const [storedFish, setStoredFish] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaughtFish, setShowCaughtFish] = useState(false);
  const [showSoldNotification, setShowSoldNotification] = useState(false);
  const [boatState, setBoatState] = useState<
    "arriving" | "docked" | "leaving" | "gone"
  >("gone");
  const [treePositions, setTreePositions] = useState<
    [number, number, number][]
  >([]);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const boatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const boatTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Handle song end - show credits
  const handleSongEnd = useCallback(() => {
    setGameState("credits");
  }, []);

  // Game audio with end detection
  const { continuePlay } = useGameAudio(
    "https://media.egecam.dev/audio/flip-flop.wav",
    gameState === "playing",
    handleSongEnd
  );

  // Start game
  const handleStartGame = useCallback(() => {
    setGameState("playing");
  }, []);

  // Continue playing after credits
  const handleContinuePlaying = useCallback(() => {
    setGameState("playing");
    continuePlay();
  }, [continuePlay]);

  // Boat arrival timer: boat comes, stays for 7 seconds, leaves, then 20 seconds later comes again
  useEffect(() => {
    if (gameState !== "playing") return;

    const triggerBoatCycle = () => {
      // Boat arrives (animation takes ~3 seconds)
      setBoatState("arriving");

      // Boat docks after arriving animation (3s)
      boatTimeoutsRef.current.push(
        setTimeout(() => setBoatState("docked"), 3000)
      );

      // Boat leaves after being docked for 7 seconds (3s + 7s = 10s)
      boatTimeoutsRef.current.push(
        setTimeout(() => setBoatState("leaving"), 10000)
      );

      // Boat is gone after leaving animation (3s + 7s + 3s = 13s)
      boatTimeoutsRef.current.push(
        setTimeout(() => setBoatState("gone"), 13000)
      );
    };

    // First boat arrives after 5 seconds
    boatTimeoutsRef.current.push(setTimeout(triggerBoatCycle, 5000));

    // Subsequent boats: 20 seconds AFTER boat is gone
    // Cycle duration is 13 seconds, so interval is 13s + 20s = 33s
    boatIntervalRef.current = setInterval(triggerBoatCycle, 33000);

    return () => {
      if (boatIntervalRef.current) clearInterval(boatIntervalRef.current);
      boatTimeoutsRef.current.forEach((t) => clearTimeout(t));
      boatTimeoutsRef.current = [];
    };
  }, [gameState]);

  const handleFishCaught = useCallback(() => {
    setFishCount((prev) => {
      if (prev < 5) {
        setShowCaughtFish(true);
        setTimeout(() => setShowCaughtFish(false), 1500);
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const handleFishStored = useCallback(() => {
    setStoredFish((prev) => prev + fishCount);
    setFishCount(0);
  }, [fishCount]);

  const handleSellFish = useCallback(() => {
    const totalFish = fishCount + storedFish;
    if (totalFish > 0) {
      setTotalSold((prev) => prev + totalFish);
      setFishCount(0);
      setStoredFish(0);
      setShowSoldNotification(true);
      setTimeout(() => setShowSoldNotification(false), 2000);

      // Add a new tree as reward
      const angle = Math.random() * Math.PI * 2;
      const distance = 1.5 + Math.random() * 1.5;
      const newTreePos: [number, number, number] = [
        Math.cos(angle) * distance,
        0.25,
        Math.sin(angle) * distance,
      ];
      setTreePositions((prev) => [...prev, newTreePos]);
    }
  }, [fishCount, storedFish]);

  const toggleFullscreen = useCallback(() => {
    if (!gameContainerRef.current) return;

    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0D3B66]">
      {/* Back button - always visible except in fullscreen */}
      {!isFullscreen && gameState !== "intro" && gameState !== "credits" && (
        <Link
          href="/"
          className="absolute top-4 left-4 z-40 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-white shadow-lg"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>
      )}

      {/* Game container - wraps everything for fullscreen */}
      <div
        ref={gameContainerRef}
        className="relative w-full h-screen bg-[#87CEEB]"
      >
        {/* INTRO SCREEN */}
        {gameState === "intro" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0D3B66] via-[#1B4F72] to-[#20B2AA]">
            <div className="text-center px-8">
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce"
                  style={{ animationDelay: "0s" }}
                >
                  🐟
                </div>
                <div
                  className="absolute top-40 right-20 text-5xl opacity-20 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  🌴
                </div>
                <div
                  className="absolute bottom-32 left-20 text-4xl opacity-20 animate-bounce"
                  style={{ animationDelay: "1s" }}
                >
                  🚤
                </div>
                <div
                  className="absolute bottom-20 right-10 text-6xl opacity-20 animate-bounce"
                  style={{ animationDelay: "1.5s" }}
                >
                  🎣
                </div>
              </div>

              {/* Title */}
              <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
                <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF6B6B] bg-clip-text text-transparent">
                  Flip Flop
                </span>
              </h1>
              <p className="text-2xl text-[#87CEEB] mb-2 font-light">
                A Cozy Fishing Experience
              </p>
              <p className="text-sm text-white/60 mb-12 max-w-md mx-auto">
                Catch fish, sell them to passing boats, and grow your island
                paradise
              </p>

              {/* Music credit */}
              <div className="mb-8 text-white/50 text-sm">
                <p>
                  🎵 Original Music by{" "}
                  <span className="text-[#FFD700]">Ege Çam</span>
                </p>
              </div>

              {/* Start button */}
              <button
                onClick={handleStartGame}
                className="group relative px-12 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0D3B66] font-bold text-xl rounded-full shadow-2xl hover:shadow-[#FFD700]/30 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">Start</span>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Controls hint */}
              <div className="mt-12 text-white/40 text-xs space-y-1">
                <p>
                  <kbd className="px-2 py-1 bg-white/10 rounded">WASD</kbd> to
                  move
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-white/10 rounded">SPACE</kbd> to
                  interact
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CREDITS SCREEN */}
        {gameState === "credits" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0D3B66] via-[#1B4F72] to-[#20B2AA]">
            <div className="text-center px-8 max-w-2xl">
              {/* Stars background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      opacity: Math.random() * 0.5 + 0.2,
                    }}
                  />
                ))}
              </div>

              {/* Credits title */}
              <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-2xl">
                Thanks for Playing!
              </h2>

              {/* Stats */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
                <h3 className="text-xl text-[#FFD700] mb-6 font-semibold">
                  Your Session
                </h3>
                <div className="grid grid-cols-3 gap-6 text-white">
                  <div>
                    <div className="text-4xl mb-2">🐟</div>
                    <div className="text-3xl font-bold">{totalSold}</div>
                    <div className="text-sm text-white/60">Fish Sold</div>
                  </div>
                  <div>
                    <div className="text-4xl mb-2">🌴</div>
                    <div className="text-3xl font-bold">
                      {treePositions.length}
                    </div>
                    <div className="text-sm text-white/60">Trees Grown</div>
                  </div>
                  <div>
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-3xl font-bold">{storedFish}</div>
                    <div className="text-sm text-white/60">Fish Stored</div>
                  </div>
                </div>
              </div>

              {/* Credits */}
              <div className="space-y-4 mb-10 text-white/70">
                <p className="text-lg">
                  <span className="text-[#FFD700]">Music & Game</span> by Ege
                  Çam
                </p>
                <p className="text-sm text-white/50">
                  "Flip Flop" - An original composition
                </p>
              </div>

              {/* Continue button */}
              <button
                onClick={handleContinuePlaying}
                className="group relative px-10 py-4 bg-gradient-to-r from-[#20B2AA] to-[#48D1CC] text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-[#20B2AA]/30 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">Continue Playing</span>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Home link */}
              <div className="mt-6">
                <Link
                  href="/"
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  ← Back to Portfolio
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* Game UI - only show when playing */}
        {gameState === "playing" && (
          <>
            {/* Fullscreen toggle */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={toggleFullscreen}
                className="rounded-full bg-white/80 backdrop-blur-sm p-3 text-gray-700 transition hover:bg-white shadow-lg"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? "✕" : "⛶"}
              </button>
            </div>

            {/* Boat arrival notification */}
            {boatState === "docked" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold animate-pulse">
                  🚤 Boat docked! Sell your fish!
                </div>
              </div>
            )}
            {boatState === "arriving" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                  🚤 Boat arriving...
                </div>
              </div>
            )}

            {/* Fish caught notification */}
            {showCaughtFish && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 animate-bounce">
                <div className="bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-xl text-lg font-bold">
                  🐟 Fish caught!
                </div>
              </div>
            )}

            {/* Sold notification */}
            {showSoldNotification && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 animate-bounce">
                <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl text-lg font-bold">
                  💰 Fish sold! +🌴 New tree!
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl">🐟</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {fishCount}/5
                  </div>
                  <div className="text-xs text-gray-500">Carrying</div>
                </div>
                <div className="w-px h-12 bg-gray-300" />
                <div className="text-center">
                  <div className="text-2xl">📦</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {storedFish}
                  </div>
                  <div className="text-xs text-gray-500">Stored</div>
                </div>
                <div className="w-px h-12 bg-gray-300" />
                <div className="text-center">
                  <div className="text-2xl">🌴</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {treePositions.length}
                  </div>
                  <div className="text-xs text-gray-500">Trees</div>
                </div>
              </div>
            </div>

            {/* Controls hint */}
            <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">
                    WASD
                  </kbd>{" "}
                  Move
                </p>
                <p>
                  <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">
                    SPACE
                  </kbd>{" "}
                  Interact
                </p>
              </div>
            </div>
          </>
        )}

        {/* Canvas - always rendered */}
        <Canvas shadows className="!absolute inset-0">
          <Scene
            onFishCaught={handleFishCaught}
            onFishStored={handleFishStored}
            onSellFish={handleSellFish}
            fishCount={fishCount}
            storedFish={storedFish}
            boatState={boatState}
            treePositions={treePositions}
          />
        </Canvas>
      </div>
    </div>
  );
}
