import Navbar from "../components/layout/Navbar"
import RepoInput from "../components/ui/RepoInput"
import {
  ShieldAlert,
  Gauge,
  CheckCircle2,
} from "lucide-react";


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
return (
    <section className="bg-[#0B0E17] min-h-screen text-white p-10">
        <Navbar/>
        <div className="mt-10 text-center">
            <h1 className="text-6xl font-bold mb-4 uppercase">Know if your<br></br>project is<br></br>ready to<span className="text-[#7B5CF6]"> ship.</span></h1>
            <p className="text-sm text-[#7A7A7A]">AI-powered auditing for your GitHub repositories. Detect security flaws<br></br>performance bottlenecks, and readiness blockers in seconds.</p>
            <div className="mt-10 flex justify-center">
                <RepoInput/>
            </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <div key={index} className="p-6 bg-[#121622] border border-[#1A1F2B] rounded-lg hover:border-[#7B5CF6] transition-colors">
                    <div className="bg-[#7B5CF6] p-3 rounded inline-block mb-4">
                    <feature.icon size={32} />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">{feature.title}</h2>
                    <p className="text-sm text-[#7A7A7A]">{feature.subtitle}</p>
                </div>
            ))}
        </div>
    </section>
)
}

export default Landing
