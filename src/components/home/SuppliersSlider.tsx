'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const suppliers = [
  { name: 'CIFA', logo: '/img/brands/cifa-logo.webp' },
  { name: 'Schwing', logo: '/img/brands/schwing-logo.png' },
  { name: 'Putzmeister', logo: '/img/brands/putzmeister-logo.png' },
  { name: 'Zoomlion', logo: '/img/brands/zoomlion.png' },
  { name: 'CIFA Italia', logo: '/img/brands/cifa-logo.webp' },
  { name: 'Schwing Stetter', logo: '/img/brands/schwing-logo.png' },
  { name: 'Putzmeister Pro', logo: '/img/brands/putzmeister-logo.png' },
  { name: 'Zoomlion Heavy', logo: '/img/brands/zoomlion.png' },
  { name: 'CIFA Engineering', logo: '/img/brands/cifa-logo.webp' },
  { name: 'Schwing Series', logo: '/img/brands/schwing-logo.png' },
];

export function SuppliersSlider() {
  const loopSuppliers = [...suppliers, ...suppliers];

  return (
    <section className="w-full bg-white px-5 pb-20 pt-16 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-center font-display text-sm uppercase tracking-[0.4em] text-epct-green">Nos fournisseurs</p>
        <h3 className="mt-3 text-center font-display text-5xl font-black uppercase tracking-tight text-epct-dark md:text-6xl">
          Reseau partenaires
        </h3>

        <div className="mt-10 overflow-hidden">
          <motion.div
            className="flex min-w-max items-center gap-8 px-1 md:gap-10"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          >
            {loopSuppliers.map((supplier, i) => (
              <div
                key={`${supplier.name}-${i}`}
                className="h-20 w-40 shrink-0 md:h-24 md:w-48 lg:h-28 lg:w-56"
              >
                <Image
                  src={supplier.logo}
                  alt={supplier.name}
                  width={320}
                  height={160}
                  sizes="(max-width: 768px) 160px, 220px"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
