"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Image from "next/image";

interface CountryStatsProps {
  name: string;
  code: string;
  gdpNominal: number;
  population: number;
  capital: string;
  currency: string;
}

export function AnimatedCountryStats({
  name,
  code,
  gdpNominal,
  population,
  capital,
  currency,
}: CountryStatsProps) {
  return (
    <>
      <div className="flex justify-center items-center gap-6 mb-12">
        <Image
          src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
          alt={`${name} flag`}
          width={80}
          height={80}
          className="rounded shadow-sm"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold tracking-tight text-gray-900"
        >
          {name}
        </motion.h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-3xl font-semibold text-gray-900">
            <CountUp
              end={gdpNominal >= 1e12 ? gdpNominal / 1e12 : gdpNominal / 1e9}
              duration={2}
              decimals={1}
              suffix={gdpNominal >= 1e12 ? "T" : "B"}
            />
          </p>
          <p className="text-sm text-gray-600 mt-1">GDP (Nominal)</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-3xl font-semibold text-gray-900">
            <CountUp end={population} duration={2} separator="," />
          </p>
          <p className="text-sm text-gray-600 mt-1">Population</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-3xl font-semibold text-gray-900">{capital}</p>
          <p className="text-sm text-gray-600 mt-1">Capital</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-3xl font-semibold text-gray-900">{currency}</p>
          <p className="text-sm text-gray-600 mt-1">Currency</p>
        </motion.div>
      </div>
    </>
  );
}
