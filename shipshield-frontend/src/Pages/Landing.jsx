import Navbar from "../components/layout/Navbar"

const Landing = () => {
  return (
    <section className="bg-[#0B0E17] min-h-screen text-white p-10">
        <Navbar/>
        <div className="mt-10 text-center">
            <h1 className="text-6xl font-bold mb-4 uppercase">Know if your<br></br>project is<br></br>ready to<span className="text-[#7B5CF6]"> ship.</span></h1>
            <p className="text-sm text-[#7A7A7A]">AI-powered auditing for your GitHub repositories. Detect security flaws<br></br>performance bottlenecks, and readiness blockers in seconds.</p>
        </div>
    </section>
  )
}

export default Landing
