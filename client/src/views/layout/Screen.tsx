import { useEffect, useLayoutEffect, useState, useRef, useMemo, memo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeMesh } from '../../redux/slice/meshSlice'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PerspectiveCamera } from 'three'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import SceneInit from './SceneInit'

extend({ TextGeometry })

type TextMeshProps = {
  id: string
  meshes: Mesh[]
  texts: string[]
  screenW: number
  screenH: number
  pos: number[]
}

type AnimateMesh = {
  id: string
  texts: string[]
  position: number[]
}

type Mesh = {
  id: string
  texts: string[]
  position: number[]
}

let animateMeshes: AnimateMesh[] = []

const fontPromise: Promise<FontLoader> = new Promise((resolve) => {
  const fontLoader = new FontLoader()
  const ttfLoader = new TTFLoader()
  ttfLoader.load('/assets/fonts/NotoSansTC-Bold.ttf', (json: any) => {
    const loadedFont: any = fontLoader.parse(json)
    resolve(loadedFont)
  })
})

const TextMesh: React.FC<TextMeshProps> = memo(({ id, meshes, texts, pos, screenW, screenH }) => {
  const dispatch = useDispatch()
  const [font, setFont] = useState<FontLoader | null>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [meshW, setMeshW] = useState(0)
  const [meshH, setMeshH] = useState(0)
  const fontSize = 20
  const fontDepth = 5
  const { camera } = useThree() as { camera: PerspectiveCamera }
  let clockValue = 0
  const position = useMemo(() => new THREE.Vector3(...pos), [pos])
  
  let lastFrameTime = 0 // 記錄上一幀動畫的時間戳
  let frameInterval = 1000 / 60 // 實現 60 FPS，所以每幀的時間間隔約為 16.67 毫秒

  // mesh position x 位置 (從畫布右側外)
  // 計算 mesh 和 screen 之間的寬度距離
  const fov = camera.fov * (Math.PI / 180) // 轉換成弧度
  const aspect = screenW / screenH // 畫布的寬高比
  const distanceFromCamera = Math.abs(camera.position.z - 0) // 物體距離相機的距離
  // 計算視錐體高度和寬度
  const frustumHeight = 2 * distanceFromCamera * Math.tan(fov / 2)
  const frustumWidth = frustumHeight * aspect

  useEffect(() => {
    fontPromise.then((loadedFont: FontLoader) => {
      setFont(loadedFont)
    })
  }, [])

  useLayoutEffect(() => {
    if (font && meshRef.current) {
      // 創建一個 group 來包含所有文字
      const group = new THREE.Group()
      let totalHeight = 0
      let maxWidth = 0
      
      // 為每個文字創建獨立的 mesh
      texts.forEach((text) => {
        const geometry = new TextGeometry(text, {
          font: font as any,
          size: fontSize,
          height: fontDepth
        })
        
        // 計算當前文字的邊界盒
        geometry.computeBoundingBox()
        const textBoundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry))
        const textSize = textBoundingBox.getSize(new THREE.Vector3())
        
        // 更新最大寬度
        maxWidth = Math.max(maxWidth, textSize.x)
        
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xf79647,
          emissive: 0xf79647
        })
        
        const textMesh = new THREE.Mesh(geometry, material)
        
        // 設置每行文字的垂直位置
        textMesh.position.y = -totalHeight
        totalHeight += textSize.y * 1.2 // 1.2 是行距係數，可以調整
        
        group.add(textMesh)
      })
      
      // 清除舊的內容
      while (meshRef.current.children.length > 0) {
        meshRef.current.remove(meshRef.current.children[0])
      }
      
      // 添加新的 group
      meshRef.current.add(group)
      
      // 更新 mesh 的寬度和高度
      setMeshW(maxWidth)
      setMeshH(totalHeight)
    }
  }, [font, texts])
  
  if(position.x === 0) {
    position.x = camera.position.x + frustumWidth / 2
  }

  // mesh position y 位置
  const minMeshPositionY = camera.position.y + frustumHeight / 2 - meshH
  const maxMeshPositionY = camera.position.y - frustumHeight / 2

  if(position.y === 0) {
    position.y = Math.random() * (maxMeshPositionY - minMeshPositionY) + minMeshPositionY
    // console.log('position.y:', position.y)
  }

  useFrame(() => {
    if (!meshRef.current) return
    const currentTime = performance.now()
    if (currentTime - lastFrameTime < frameInterval) return
  
    lastFrameTime = currentTime

    requestAnimationFrame(() => {
      if (meshRef.current) {
        meshRef.current.position.x = xPosition
      }
    })

      clockValue = clockValue + 0.5
      const xPosition = position.x - clockValue // 右往左移
      meshRef.current.position.x = xPosition
      
      // 移出画面后移除 mesh 实体
      if (xPosition < position.x - frustumWidth - meshW) {
        const newMeshes = meshes.filter((mesh: Mesh) => mesh.id !== id.toString())
        dispatch(
          removeMesh(newMeshes)
        )

        meshRef.current.visible = false // 結束

        animateMeshes = animateMeshes.filter(mesh => mesh.id !== id.toString())
        // console.log('結束', animateMeshes)
      } else {
        meshRef.current.visible = true // 開始
        // console.log('開始')

        const animateMesh = {
          id: id.toString(),
          texts: texts,
          position: [xPosition, position.y, position.z],
        }

        const existingMeshIndex = animateMeshes.findIndex(mesh => mesh.id === id.toString())
        if (existingMeshIndex !== -1) {
          animateMeshes[existingMeshIndex] = animateMesh
        } else {
          animateMeshes.push(animateMesh)
        }
      }
  })

  if (!font) return null
  
  return (
    <mesh ref={meshRef} position={position}>
      <meshPhysicalMaterial color={0xf79647} emissive={0xf79647} />
    </mesh>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数，只有在必要的属性发生变化时才重新渲染
  return (
    prevProps.id === nextProps.id &&
    prevProps.texts === nextProps.texts &&
    JSON.stringify(prevProps.pos) === JSON.stringify(nextProps.pos) &&
    prevProps.screenW === nextProps.screenW &&
    prevProps.screenH === nextProps.screenH
  )
})
const ScreenCanvas : React.FC<{ screenW: number, screenH: number }> = ({ screenW, screenH }) => {
  const meshes: Mesh[] = useSelector((state: any) => state.meshes)
  const [renderMeshes, setRenderMeshes] = useState<Mesh[]>([])
  
  // 使用 useCallback 优化渲染逻辑
  const updateRenderMeshes = useCallback(() => {
    if (meshes.length === 0) {
      animateMeshes = []
      setRenderMeshes([])
      return
    }

    const newRenderMeshes = meshes.map(mesh => {
      const animatedMesh = animateMeshes.find(aniMesh => aniMesh.id === mesh.id.toString())
      return animatedMesh || mesh
    })

    setRenderMeshes(newRenderMeshes)
  }, [meshes])

  useEffect(() => {
    updateRenderMeshes()
  }, [meshes, updateRenderMeshes])

  const memoizedRenderMeshes = useMemo(() => {
    
    return renderMeshes.map((mesh) => (
      <TextMesh
        key={mesh.id}
        id={mesh.id}
        meshes={meshes}
        texts={mesh.texts}
        pos={mesh.position}
        screenW={screenW}
        screenH={screenH}
      />
    ))
  }, [renderMeshes, meshes, screenW, screenH])

  return (
    <Canvas camera={{ position: [0, 0, 120] }}>
      <SceneInit />
      {memoizedRenderMeshes}
    </Canvas>
  )
}

const Screen: React.FC = () => {
  const screenRef = useRef<null>(null)
  const [screenW, setScreenW] = useState<number>(0)
  const [screenH, setScreenH] = useState<number>(0)
  
  useEffect(() => {
    if(screenRef.current) {
      const newScreenW = (screenRef.current as HTMLElement).offsetWidth
      const newScreenH = (screenRef.current as HTMLElement).offsetHeight
      setScreenW(newScreenW)
      setScreenH(newScreenH)
    }
  }, [screenW, screenH])

  return (
    <div className="w-100% h-100% flex flex-(col) p-10 md:(p-20)">
      <div className="u-concave w-100% h-100% bg-light rounded-12 before:(rounded-12) after:(rounded-12) dark:bg-dark" ref={screenRef}>
        <ScreenCanvas screenW={screenW} screenH={screenH} />
      </div>
    </div>
  )
}

export default Screen
