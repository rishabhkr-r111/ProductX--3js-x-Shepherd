import "./App.css";
import * as THREE from "three";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, Text, Html } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { DDSLoader } from "three-stdlib";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSpring, animated, easings } from "@react-spring/three";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const Scene = ({ setLoading, tour }) => {
  const { camera } = useThree();
  // useFrame(() => {
  //   console.log(camera.position);
  // });

  const materials = useLoader(MTLLoader, "mobile.mtl");
  const obj = useLoader(OBJLoader, "mobile.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
    () => setLoading(false);
  });

  console.log(obj);

  const initialPosition = [-2, -2, 0];
  const finalPosition = [0, 0, 0];
  const initialRotation = [Math.PI / 4, Math.PI / 2, Math.PI];
  const finalRotation = [0, 0, 0];

  const { position, rotation } = useSpring({
    from: { position: initialPosition, rotation: initialRotation },
    to: { position: finalPosition, rotation: finalRotation },
    config: {
      duration: 3000,
      easing: easings.easeInOutCubic,
    },
  });

  const handleTourStart = () => {
    tour.start();
  };

  return (
    <>
      <animated.primitive
        object={obj}
        scale={0.01}
        position={position}
        rotation={rotation}
      />
      <Text
        position={[0.01, 0.01, 7]}
        rotation={[Math.PI, 0, Math.PI]}
        fontSize={3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Product X
      </Text>
      <Html position={[0.03, -0.15, 0.3]}>
        <TrendingFlatIcon
          onClick={handleTourStart}
          sx={{ fontSize: 70, color: "white" }}
        />
      </Html>
    </>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  const [tour, setTour] = useState(null);

  useEffect(() => {
    const tourInstance = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: "shepherd-theme-default",
        scrollTo: { behavior: "smooth", block: "center" },
      },
      useModalOverlay: true,
    });

    tourInstance.addStep({
      id: "start",
      text: "This is the starting point of the tour.",
      attachTo: { element: ".tour-button", on: "right" },
      buttons: [
        {
          text: "Next",
          action: tourInstance.next,
        },
      ],
    });

    tourInstance.addStep({
      id: "feature1",
      text: "This is feature 1 of the product.",
      attachTo: { element: ".text", on: "top" },
      buttons: [
        {
          text: "Next",
          action: tourInstance.next,
        },
      ],
    });

    tourInstance.addStep({
      id: "feature2",
      text: "This is feature 2 of the product.",
      attachTo: { element: ".feature2", on: "top" },
      buttons: [
        {
          text: "Next",
          action: tourInstance.next,
        },
      ],
    });

    setTour(tourInstance);
  }, []);

  return (
    <div className="App">
      <nav>
        <div className="text">Product X</div>
      </nav>
      <Canvas
        camera={{
          position: [
            0.00012044802437093873, 0.00006352461885423019,
            -0.0015611709999744413,
          ],
          fov: 75,
        }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="loading-text">Loading...</div>
            </Html>
          }
        >
          <ambientLight intensity={0.5} />
          <OrbitControls />
          <Scene setLoading={setLoading} tour={tour} />
          {/* <Environment preset="studio" background /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
