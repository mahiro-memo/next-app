'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Line, Sphere } from '@react-three/drei';
import type { ThreeDData, DisplayOptions } from './types';
import * as THREE from 'three';

interface ThreeSceneProps {
  data: ThreeDData | null;
  options: DisplayOptions;
}

export default function ThreeScene({ data, options }: ThreeSceneProps) {
  if (!data) {
    return (
      <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">計算結果がありません</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-900 rounded-lg">
      <Canvas camera={{ position: [200, 200, 200], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* 回転軸 */}
        {options.showAxis && (
          <Line
            points={[
              new THREE.Vector3(...data.axisLine.start),
              new THREE.Vector3(...data.axisLine.end),
            ]}
            color="red"
            lineWidth={2}
          />
        )}
        
        {/* 軌道円 */}
        {options.showOrbit && (
          <Line
            points={data.orbitCircle.map(p => new THREE.Vector3(...p))}
            color="blue"
            lineWidth={1}
          />
        )}
        
        {/* 点 */}
        {options.showPoints && (
          <>
            {/* 固定点 A */}
            <Sphere args={[5, 16, 16]} position={data.points.A}>
              <meshStandardMaterial color="green" />
            </Sphere>
            
            {/* 初期点 B0 */}
            <Sphere args={[5, 16, 16]} position={data.points.B0}>
              <meshStandardMaterial color="orange" />
            </Sphere>
            
            {/* 解の位置 B(θ1) */}
            {data.points.B_theta1 && (
              <Sphere args={[5, 16, 16]} position={data.points.B_theta1}>
                <meshStandardMaterial color="yellow" />
              </Sphere>
            )}
            
            {/* 解の位置 B(θ2) */}
            {data.points.B_theta2 && (
              <Sphere args={[5, 16, 16]} position={data.points.B_theta2}>
                <meshStandardMaterial color="yellow" />
              </Sphere>
            )}
          </>
        )}
        
        {/* チェーン線 */}
        {options.showChains && data.chainLines.map((line, i) => (
          <Line
            key={i}
            points={[
              new THREE.Vector3(...line[0]),
              new THREE.Vector3(...line[1]),
            ]}
            color="gray"
            lineWidth={1.5}
          />
        ))}
        
        {/* 公差範囲 */}
        {options.showTolerance && (
          <>
            {data.points.B_min && (
              <Sphere args={[4, 16, 16]} position={data.points.B_min}>
                <meshStandardMaterial color="cyan" transparent opacity={0.5} />
              </Sphere>
            )}
            {data.points.B_max && (
              <Sphere args={[4, 16, 16]} position={data.points.B_max}>
                <meshStandardMaterial color="magenta" transparent opacity={0.5} />
              </Sphere>
            )}
          </>
        )}
        
        <Grid args={[500, 500]} cellColor="#6e6e6e" sectionColor="#9d9d9d" />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
