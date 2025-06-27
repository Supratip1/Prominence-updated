import React, { useRef, useLayoutEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Hook to get scroll progress in [0,1]
function useScrollProgress(totalSections: number) {
  const [progress, setProgress] = useState(0)
  useLayoutEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      const p = Math.min(Math.max(scrollY / docHeight, 0), 1)
      setProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

// Component: places planes and moves camera
function Scene({ images, titles, descriptions }: { 
  images: string[]
  titles: string[]
  descriptions: string[]
}) {
  const scrollProg = useScrollProgress(images.length)
  const { camera } = useThree()
  
  // Preload textures
  const textures = useRef<THREE.Texture[]>([])
  useLayoutEffect(() => {
    const loader = new THREE.TextureLoader()
    images.forEach((src, i) => {
      loader.load(src, (tex) => {
        tex.minFilter = THREE.LinearFilter
        textures.current[i] = tex
      })
    })
  }, [images])
  
  // Camera movement
  useFrame(() => {
    const gap = 8
    const zPos = -scrollProg * (images.length - 1) * gap
    camera.position.lerp(new THREE.Vector3(0, 0, zPos + 5), 0.1)
    camera.updateProjectionMatrix()
  })
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      {images.map((src, idx) => {
        const z = -idx * 8
        const xOffset = (idx % 2) * 3 - 1.5
        const yOffset = Math.sin(idx * 0.5) * 0.5
        
        // Calculate parallax effect
        const parallaxX = xOffset + Math.sin(scrollProg * Math.PI * 2 + idx) * 0.5
        const parallaxY = yOffset + Math.cos(scrollProg * Math.PI * 2 + idx) * 0.3
        const rotationY = Math.sin(scrollProg * Math.PI + idx) * 0.1
        
        return (
          <mesh 
            key={idx} 
            position={[parallaxX, parallaxY, z]}
            rotation={[0, rotationY, 0]}
          >
            <planeGeometry args={[6, 4]} />
            <meshStandardMaterial 
              map={textures.current[idx] || null} 
              transparent 
              opacity={0.9}
            />
            
            {/* Title overlay */}
            <Html position={[0, -2.5, 0]} center>
              <div className="text-white text-center bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                <h3 className="text-lg font-bold">{titles[idx]}</h3>
                <p className="text-sm opacity-80">{descriptions[idx]}</p>
              </div>
            </Html>
          </mesh>
        )
      })}
    </>
  )
}

// Overlay UI component
function OverlayUI({ images, titles }: { images: string[], titles: string[] }) {
  const scrollProg = useScrollProgress(images.length)
  
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <div className="absolute top-20 left-10">
        <motion.div
          className="text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white mb-4">How Prominence Works</h2>
          <p className="text-xl opacity-80 max-w-md">
            Scroll to explore our platform's powerful features in 3D
          </p>
        </motion.div>
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-20 right-10">
        <motion.div
          className="text-white text-right"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-sm opacity-60 mb-2">Progress</div>
          <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-400 rounded-full"
              style={{ width: `${scrollProg * 100}%` }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Main component for section
export default function Screenshot3DSection() {
  const images = [
    '/screenshots/Assetfetching.png',
    '/screenshots/fetched.png',
    '/screenshots/jira.png',
    '/screenshots/optimization.png',
    '/screenshots/score.png',
  ]
  
  const titles = [
    'Discover',
    'Track', 
    'Integrate',
    'Optimize',
    'Analyze'
  ]
  
  const descriptions = [
    'Automatically discover and fetch your digital assets',
    'Monitor your assets in real-time with comprehensive tracking',
    'Seamlessly integrate with your existing workflow tools',
    'Get intelligent optimization suggestions',
    'View comprehensive analytics and scoring dashboards'
  ]
  
  // Ensure section height tall enough to scroll through all
  const totalHeight = images.length * window.innerHeight
  
  return (
    <div style={{ height: totalHeight, position: 'relative' }}>
      <Canvas
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
        }}
        camera={{ fov: 60, position: [0, 0, 5] }}
        dpr={[1, 1.5]}
      >
        <Scene images={images} titles={titles} descriptions={descriptions} />
      </Canvas>
      
      <OverlayUI images={images} titles={titles} />
    </div>
  )
} 