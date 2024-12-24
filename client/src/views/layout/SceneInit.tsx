import { useEffect } from 'react';
import { DirectionalLight } from 'three'

function SceneInit() {
  useEffect(() => {
    // NOTE: Lighting setup
    // const ambientLight = new AmbientLight(0xffffff, 0.5)
    const directionalLight = new DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 32, 64)
    // const spotLight = new SpotLight(0xffffff, 1);
    // spotLight.position.set(100, 1000, 100);

    // NOTE: Add lights to the scene
    return () => {
      // Clean up lights if necessary
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 32, 64]} intensity={1} />
      {/* <OrbitControls /> */}
    </>
  );
}

export default SceneInit;