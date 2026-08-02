// src/components/public/services/technologies-section.tsx

"use client";

import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiDocker,
  SiOpenid,
  SiPython,
  SiSolidity,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const technologies = [
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express", icon: SiExpress },
  { name: "MongoDB", icon: SiMongodb },
  { name: "MySQL", icon: SiMysql },
  { name: "Docker", icon: SiDocker },
  { name: "AWS", icon: FaAws },
  { name: "OpenAI", icon: SiOpenid },
  { name: "Python", icon: SiPython },
  { name: "Solidity", icon: SiSolidity },
];

export default function TechnologiesSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Technologies
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
            Modern Technology
            <span className="block text-blue-600">
              Stack We Love
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            We carefully choose technologies that provide performance,
            maintainability and long-term scalability.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;

            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: .8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * .05 }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >
                <Icon className="mx-auto text-5xl text-blue-600 transition group-hover:scale-110" />

                <p className="mt-6 text-center font-semibold text-slate-800">
                  {tech.name}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}