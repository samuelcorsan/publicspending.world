import * as THREE from "three";
import countries from "@/constants/countries.json";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import ThreeGlobe from "three-globe";
import arcsData from "@/constants/arcs.json";

extend({ ThreeGlobe });

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: React.JSX.IntrinsicElements["object3D"] & {
      args?: [ThreeGlobe];
    };
  }
}

interface GlobeComponentProps {
  globeConfig: {
    showAtmosphere: boolean;
    atmosphereColor: string;
    atmosphereAltitude: number;
    polygonColor: string;
    globeColor: string;
    emissive: string;
    emissiveIntensity: number;
    shininess: number;
    arcColor: string;
    arcStroke: number;
    arcDashLength: number;
    arcDashGap: number;
    arcDashAnimateTime: number;
  };
  rotationSpeed: number;
}

interface ArcData {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
}

const GlobeComponent: React.FC<GlobeComponentProps> = ({
  globeConfig,
  rotationSpeed,
}) => {
  const globeRef = useRef<ThreeGlobe | null>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += rotationSpeed;
    }
  });

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current as ThreeGlobe;
      globe
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.5)
        .showAtmosphere(globeConfig.showAtmosphere)
        .atmosphereColor(globeConfig.atmosphereColor)
        .atmosphereAltitude(globeConfig.atmosphereAltitude)
        .hexPolygonColor(() => globeConfig.polygonColor);

      const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
      globeMaterial.color = new THREE.Color(globeConfig.globeColor);
      globeMaterial.emissive = new THREE.Color(globeConfig.emissive);
      globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity;
      globeMaterial.shininess = globeConfig.shininess;

      globe
        .arcsData(arcsData.arcs)
        .arcStartLat((d: object) => (d as ArcData).startLat)
        .arcStartLng((d: object) => (d as ArcData).startLon)
        .arcEndLat((d: object) => (d as ArcData).endLat)
        .arcEndLng((d: object) => (d as ArcData).endLon)
        .arcColor(() => globeConfig.arcColor)
        .arcStroke(globeConfig.arcStroke)
        .arcDashLength(globeConfig.arcDashLength)
        .arcDashGap(globeConfig.arcDashGap)
        .arcDashInitialGap(() => Math.random() * 4)
        .arcDashAnimateTime(globeConfig.arcDashAnimateTime);
    }
  }, [globeConfig]);

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
};

interface GlobeProps {
  rotationSpeed?: number;
}

const Globe: React.FC<GlobeProps> = ({ rotationSpeed = 0.0015 }) => {
  const { theme } = useTheme();
  const [globeColor, setGlobeColor] = useState<string>("#F4F4F4");
  const [emissiveColor, setEmissiveColor] = useState<string>("#F4F4F4");
  const [polygonColor, setPolygonColor] = useState<string>("rgba(0,0,0,0.3)");

  useEffect(() => {
    if (theme === "dark") {
      setGlobeColor("#171717");
      setEmissiveColor("#171717");
      setPolygonColor("rgba(255,255,255,0.6)");
    } else {
      setGlobeColor("#F4F4F4");
      setEmissiveColor("#F4F4F4F");
      setPolygonColor("rgba(0,0,0,0.3)");
    }
  }, [theme]);

  const globeConfig = {
    atmosphereColor: "#6366f1",
    showAtmosphere: true,
    atmosphereAltitude: 0.25,
    polygonColor: polygonColor,
    globeColor: globeColor,
    emissive: emissiveColor,
    emissiveIntensity: 1,
    shininess: 1,
    arcColor: "#4f46e5",
    arcStroke: 0.5,
    arcDashLength: 0.9,
    arcDashGap: 4,
    arcDashAnimateTime: 1000,
  };

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 225] }}>
        <ambientLight intensity={3} />

        <GlobeComponent
          globeConfig={globeConfig}
          rotationSpeed={rotationSpeed}
        />
      </Canvas>
    </div>
  );
};

export default Globe;
