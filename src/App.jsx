import "./App.css";
import * as THREE from "three";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { DDSLoader } from "three-stdlib";
import { Suspense, useEffect, useState } from "react";
import { useSpring, animated, easings } from "@react-spring/three";
import NavBar from "./comp/navBar";
import PosArr from "./consts";
import Shepherd from "shepherd.js";
import "./shepherd-dark-mode.css";

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const Scene = () => {
  const [tour, setTour] = useState(null);
  const [starRotation, setStartRotation] = useState(false);

  const { camera } = useThree();

  const [springProps, setSpringProps] = useSpring(() => ({
    position: PosArr[4].position,
    rotation: PosArr[4].position,
    config: {
      duration: 2000,
      easing: easings.easeInOutCubic,
    },
  }));

  useFrame(() => {
    if (starRotation) {
      camera.position.set(...springProps.position.get());
      camera.rotation.set(...springProps.rotation.get());
    }
  });

  const rotateCamera = (pos) => {
    return new Promise((resolve) => {
      setSpringProps({
        position: PosArr[pos].position,
        rotation: PosArr[pos].rotation,
        onRest: resolve,
      });

      setStartRotation(true);
    });
  };
  const materials = useLoader(MTLLoader, "mobile.mtl");
  const obj = useLoader(OBJLoader, "mobile.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

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

  useEffect(() => {
    const tourInstance = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: "shepherd-theme-dark",
        scrollTo: { behavior: "smooth", block: "center" },
      },
      useModalOverlay: false,
    });

    tourInstance.addStep({
      id: "feature1",
      text: "Product Feature 1",
      attachTo: { element: ".first", on: "right" },
      buttons: [
        {
          text: "Next",
          action: tourInstance.next,
        },
      ],
      beforeShowPromise: () => {
        return rotateCamera(0);
      },
    });

    tourInstance.addStep({
      id: "feature2",
      text: "Product Feature 2",
      attachTo: { element: ".second", on: "left" },
      buttons: [
        {
          text: "Next",
          action: tourInstance.next,
        },
      ],
      beforeShowPromise: () => {
        return rotateCamera(1);
      },
    });

    tourInstance.addStep({
      id: "feature3",
      text: "Product feature 3",
      attachTo: { element: ".third", on: "top" },
      buttons: [
        {
          text: "Next",
          action: tourInstance.next,
        },
      ],
      beforeShowPromise: () => {
        return rotateCamera(2);
      },
    });

    tourInstance.addStep({
      id: "end",
      text: "Buy Now",
      buttons: [
        {
          text: "Finish",
          action: tourInstance.complete,
        },
      ],
      beforeShowPromise: () => {
        return rotateCamera(3);
      },
    });

    tourInstance.on("complete", async () => {
      await rotateCamera(4);
      setStartRotation(false);
    });

    tourInstance.on("cancel", async () => {
      await rotateCamera(4);
      setStartRotation(false);
    });

    setTour(tourInstance);
  }, [obj]);

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
      <Html position={[0.0, 0.0, 0.0]}>
        <div className="first"></div>
      </Html>
      <Html position={[0.0005, 0.0, 0.0]}>
        <div className="second"></div>
      </Html>
      <Html position={[0.0, 0.00001, 0.0]}>
        <div className="third"></div>
      </Html>
      <Text
        position={[0.01, 0.01, 7]}
        rotation={[Math.PI, 0, Math.PI]}
        fontSize={3}
        color="white"
        anchorX="center"
        anchorY="middle"
        className="test"
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
  return (
    <div className="App">
      <NavBar />
      <Canvas
        camera={{
          position: PosArr[4].position,
          fov: 75,
        }}
      >
        <Suspense>
          <ambientLight intensity={0.5} />
          <OrbitControls />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
