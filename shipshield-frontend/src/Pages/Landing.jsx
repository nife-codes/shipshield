import Navbar from "../components/layout/Navbar"
import RepoInput from "../components/ui/RepoInput"
import {
  ShieldAlert,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";


const Landing = () => {

    const features =[
        {
        icon: ShieldAlert,    
        title: "Vulnerability Scan",
        subtitle: "Deep dependency analysis to identify CVEs and insecure code patterns before they reach production."
        },
        {
        icon: Gauge,
        title: "Performance Audit",
        subtitle: "Detect N+1 queries, unoptimized assets, and potential bottlenecks in your codebase structure."
        },
        {
        icon: CheckCircle2,
        title: "Best Practices",
        subtitle: "Ensure your code follows industry standards for readability, maintainability, and documentation."
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

return (
    <>
    <Navbar/>
    <section className="bg-[#0B0E17] min-h-screen text-white p-6 md:p-10 flex flex-col items-center">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-10 md:mt-20 text-center max-w-4xl"
        >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase leading-tight">
                Know if your<br className="hidden md:block" /> project is<br className="hidden md:block" /> ready to 
                <motion.span 
                    initial={{ color: "#ffffff" }}
                    animate={{ color: "#7B5CF6" }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-[#7B5CF6]"
                >  ship.</motion.span>
            </h1>
            <p className="text-sm md:text-base text-[#7A7A7A] mt-4 max-w-2xl mx-auto px-4">
                AI-powered auditing for your GitHub repositories. Detect security flaws,
                performance bottlenecks, and readiness blockers in seconds.
            </p>
            <div className="mt-10 flex justify-center w-full px-4">
                <RepoInput/>
            </div>
        </motion.div>

        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
        >
            {features.map((feature, index) => (
                <motion.div 
                    key={index} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, borderColor: '#7B5CF6' }}
                    className="p-6 bg-[#121622] border border-[#1A1F2B] rounded-lg transition-colors cursor-default"
                >
                    <div className="bg-[#7B5CF6] p-3 rounded inline-block mb-4 shadow-lg shadow-[#7b5cf633]">
                    <feature.icon size={32} />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">{feature.title}</h2>
                    <p className="text-sm text-[#7A7A7A] leading-relaxed">{feature.subtitle}</p>
                </motion.div>
            ))}
        </motion.div>
    </section>
    </>
)
}

export default Landing
