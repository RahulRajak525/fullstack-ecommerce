import React from "react";
import { motion } from "motion/react";
import { FiRefreshCw, FiShield, FiHeadphones, FiTruck } from "react-icons/fi";
import { staggerChild, staggerParent } from "./ui/motionVariants";

const policies = [
  {
    icon: FiRefreshCw,
    title: "Easy exchange",
    body: "Swap a size or colour within 7 days, no questions asked.",
  },
  {
    icon: FiShield,
    title: "7-day returns",
    body: "Changed your mind? Send it back for a full refund.",
  },
  {
    icon: FiTruck,
    title: "Free shipping",
    body: "Complimentary delivery on every order above $80.",
  },
  {
    icon: FiHeadphones,
    title: "Support 24/7",
    body: "Real people, ready to help whenever you need them.",
  },
];

const OurPolicy = () => {
  return (
    <motion.section
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-4 py-16 sm:grid-cols-2 lg:grid-cols-4"
    >
      {policies.map(({ icon: Icon, title, body }) => (
        <motion.div
          key={title}
          variants={staggerChild}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="group rounded-2xl border border-ink-200 bg-white p-6 transition-shadow hover:shadow-lift"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-100 text-ink-800 transition-colors group-hover:bg-ink-900 group-hover:text-white">
            <Icon className="text-lg" />
          </div>
          <p className="mt-4 text-sm font-semibold text-ink-900">{title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>
        </motion.div>
      ))}
    </motion.section>
  );
};

export default OurPolicy;
