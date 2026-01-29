import React from 'react';
import { FileText, Calendar, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../animations/variants';

const History = () => {
    const [historyData, setHistoryData] = React.useState([]);

    React.useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('shipshield_history') || '[]');

        // Helper to map score to Grade
        const getGrade = (score) => {
            if (score >= 90) return 'A+'; // Adjusted threshold
            if (score >= 80) return 'A';
            if (score >= 70) return 'B';
            if (score >= 50) return 'C';
            return 'F';
        };

        const getColor = (grade) => {
            if (grade.startsWith('A')) return 'text-green-700 bg-green-200';
            if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
            if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
            return 'text-red-700 bg-red-200';
        };

        const formatted = saved.map(item => {
            const grade = getGrade(item.score);
            return {
                id: item.id,
                repo: item.repo.replace('https://github.com/', ''),
                date: new Date(item.date).toLocaleDateString(),
                score: grade,
                scoreColor: getColor(grade),
                size: 'N/A' // Size not currently in analysis result
            };
        });

        if (formatted.length === 0) {
            // Keep mock data if empty? Or just show empty. Let's show mock if empty for demo.
            setHistoryData([
                { id: 1, repo: 'shipshield-frontend', date: '2 mins ago', score: 'B+', scoreColor: 'text-yellow-600 bg-yellow-100', size: '2.4 MB' },
                { id: 2, repo: 'backend-api-v2', date: 'Yesterday', score: 'A', scoreColor: 'text-green-600 bg-green-100', size: '1.8 MB' },
            ]);
        } else {
            setHistoryData(formatted);
        }
    }, []);



    return (
        <section className='min-h-screen bg-gray-50'>
            <header className='bg-white border-b border-[#E2E8F0] px-6 py-4  mb-4'>
                <h1 className='text-3xl font-bold text-gray-900'>Scan History</h1>
                <p className='text-gray-500 mt-2'>Review past audit reports and scores.</p>
            </header>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6"
            >
                {historyData.map((item) => (
                    <motion.div
                        key={item.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
                    >

                        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-100 rotate-45 group-hover:bg-gray-200 transition-colors"></div>
                        </div>

                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-gray-400 group-hover:text-[#4F5BD5] group-hover:bg-[#E0E4FF] transition-colors">
                            <FileText size={32} />
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-1 truncate w-full" title={item.repo}>
                            {item.repo}
                        </h3>

                        <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                            <Clock size={12} /> {item.date} • {item.size}
                        </div>

                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${item.scoreColor}`}>
                            Score: {item.score}
                        </div>

                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default History;
