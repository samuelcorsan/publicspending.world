"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import countries from "@/constants/countries.json";
import arcsData from "@/constants/arcs.json";
import { useTheme } from "next-themes";
import { SearchBar } from "./SearchBar";
import countryData from "@/app/api/data.json";

extend({ ThreeGlobe });

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: React.JSX.IntrinsicElements["object3D"] & {
      args?: [ThreeGlobe];
    };
  }
}

export default function Hero() {
  return (
    <div className="relative z-[1] w-full">
      <div className="relative h-[900px] w-full before:absolute before:inset-0 before:bottom-0 before:z-[1] md:before:[mask-image:radial-gradient(ellipse_30%_40%_at_50%_20%,transparent_50%,#000_100%)] before:[mask-image:radial-gradient(ellipse_70%_30%_at_50%_20%,transparent_50%,#000_100%)] before:bg-gray-50 dark:before:bg-black">
        <Globe />
      </div>

      <div className="px-6 lg:px-8 absolute inset-x-0 top-1/4 z-10">
        <div className="mx-auto max-w-5xl py-16 sm:py-28">
          <div className="absolute left-1/2 -translate-x-1/2 -top-36 whitespace-nowrap bg-neutral-50 dark:bg-neutral-950 rounded-full px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 border border-neutral-200 hover:border-neutral-300 dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors duration-300">
            New feature.{" "}
            <a href="#" className="text-indigo-500">
              <span aria-hidden="true" className="absolute inset-0" />
              Read more
            </a>
          </div>
          <div className="text-center max-w-3xl mx-auto relative z-[1]">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-800 dark:text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 via-white to-neutral-300 sm:text-6xl">
              Connect the World, Share Without Borders
            </h1>
            <p className="mt-6 md:mt-8 text-balance text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Unite communities and bridge distances with a platform designed to
              foster global collaboration, inspire creativity, and break down
              barriers—wherever you are.
            </p>
            <div className="mt-8 md:mt-10 flex items-center justify-center gap-x-6">
              <SearchBar countries={countryData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
