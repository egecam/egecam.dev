"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Writing", href: "/blog" },
  // Creative Garden is hidden in production
  ...(process.env.NEXT_PUBLIC_SHOW_CREATIVE_GARDEN === "true"
    ? [{ name: "Creative Garden", href: "/creative" }]
    : []),
  { name: "Contact", href: "/contact" },
];

function Sidebar() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 0.1], [0, 10]);

  const isCreativePage = pathname === "/creative";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20, x: 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.5 }}
      style={isCreativePage ? { opacity, y } : undefined}
      className={`
        fixed top-0 left-0 w-full 
        md:top-20 md:left-8 md:w-40 xl:left-16 2xl:left-24
        bg-background/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none
        z-50 transition-all duration-300
        ${isCreativePage ? "md:hover:opacity-100" : ""}
      `}
    >
      <motion.div
        className={`
          md:p-4 md:rounded-2xl transition-all duration-300
          ${
            isCreativePage
              ? "md:bg-background/5 md:hover:bg-background/10 md:shadow-lg"
              : ""
          }
        `}
      >
        <ul
          className="
            flex items-center justify-around px-6 h-16
            md:h-auto md:block md:px-0 md:space-y-4
          "
        >
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Link
                  href={item.href}
                  className={`
                    text-sm transition-colors inline-flex items-center
                    md:hover:translate-x-1 md:transform
                    ${
                      isActive
                        ? "text-accent"
                        : "text-primary/60 hover:text-accent"
                    }
                  `}
                >
                  {item.name}
                  <span
                    className={`
                      absolute bottom-0 left-0 h-0.5 bg-accent 
                      transition-all duration-300 ease-out
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                      md:hidden
                    `}
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>
    </motion.nav>
  );
}

export default Sidebar;
