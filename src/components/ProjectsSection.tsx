import React, { useState } from "react";
import { motion } from "motion/react";
import projectsData from "../data/projects.json";

/* Only the first 3 projects display here on the homepage.
   To add/edit projects, edit src/data/projects.json directly. */
const featuredProjects = projectsData.projects.slice(0, 3);

interface ProjectsSectionProps {
  onNavigateProject?: (path: string) => void;
}

export default function ProjectsSection({ onNavigateProject }: ProjectsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section 
      id="projects-section"
      className="w-full bg-[#080808] text-[#f0ece4] py-16 md:py-20 select-none relative z-20 pointer-events-auto overflow-hidden px-6 md:px-12 lg:px-16"
    >
      {/* Structural Top Header Line */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-baseline">
          <h2 className="font-display italic text-[clamp(32px,5vw,64px)] text-[#f0ece4] leading-none">
            Selected Work
          </h2>
          <span className="font-mono text-[12px] text-[#6b6560] tracking-wider">
            03
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#1a1a1a]" />
      </div>

      {/* Projects List Container */}
      <div className="mt-6 flex flex-col w-full">
        {featuredProjects.map((project, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={project.slug}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              onClick={() => onNavigateProject?.(`/projects/${project.slug}`)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              data-cursor="true"
              data-cursor-label={`VIEW ${project.name}`}
              className="relative w-full border-b border-[#1a1a1a] py-5 md:py-6 flex items-center gap-4 md:gap-6 transition-colors duration-200 hover:bg-[#0f0f0f] group cursor-none px-3 md:px-6 -mx-3 md:-mx-6 rounded-sm"
            >
              {/* Dot Indicator */}
              <div 
                className="w-[5px] h-[5px] rounded-full bg-[#C8FF00] transition-all duration-300 shrink-0"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scale(1)" : "scale(0.5)"
                }}
              />

              {/* Project Number */}
              <span className="font-mono text-[11px] text-[#6b6560] w-6 shrink-0">
                {project.num}
              </span>

              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 
                    className="font-satoshi font-bold text-[clamp(18px,2.5vw,32px)] text-[#f0ece4] leading-tight transition-transform duration-300 ease-out"
                    style={{
                      transform: isHovered ? "translateX(6px)" : "translateX(0px)"
                    }}
                  >
                    {project.name}
                  </h3>
                  <span className="font-satoshi text-sm text-[#6b6560] hidden sm:inline">
                    {project.desc}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="font-mono text-[10px] text-[#6b6560] px-2 py-0.5 border border-[#222222] rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Arrow */}
              <span 
                className="font-mono text-[12px] text-[#6b6560] transition-all duration-300 shrink-0"
                style={{
                  opacity: isHovered ? 1 : 0.4,
                  transform: isHovered ? "translateX(0px)" : "translateX(-4px)"
                }}
              >
                →
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
