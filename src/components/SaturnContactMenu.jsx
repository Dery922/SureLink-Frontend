import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import { SiTelegram } from "react-icons/si";

const socials = [
  // {
  //   icon: FaWhatsapp,
  //   href: "https://wa.me/233000000000",
  // },
  //   {
  //     icon: FaTelegramPlane,
  //     href: "https://t.me/yourchannel",
  //   },
  {
    icon: FaInstagram,
    href: "https://instagram.com",
  },
  {
    icon: FaFacebookF,
    href: "https://facebook.com",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com",
  },
  {
    icon: FaEnvelope,
    href: "mailto:support@example.com",
  },
];

export default function SaturnContactMenu() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const radius = 130;

  return (
    <motion.div
      className="fixed z-50"
      style={{ left: "50%", top: "50%" }}
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        setPos((prev) => ({
          x: prev.x + info.offset.x,
          y: prev.y + info.offset.y,
        }));
      }}
      animate={{ x: pos.x, y: pos.y }}
    >
      {/* WHEEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute left-1/2 top-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.3)]" />

              {socials.map((item, index) => {
                const angle = (index / socials.length) * Math.PI * 2;

                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                const Icon = item.icon;

                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    target="_blank"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{ x, y, opacity: 1, scale: 1 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center">
                      <Icon className="text-2xl text-sky-600" />
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN BUTTON */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl"
      >
        Help
      </motion.button>
    </motion.div>
  );
}
