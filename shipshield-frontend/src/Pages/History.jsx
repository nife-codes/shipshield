import React from 'react';
import { FileText, Calendar, Clock, Star } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../animations/variants';
import { formatHistoryData } from '../lib/history';
import { api } from '../services/api';

const History = () => {
    const [historyData, setHistoryData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.getHistory();
                const formattedData = formatHistoryData(data);
                setHistoryData(formattedData);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
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
                {loading && [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
                        <Skeleton className="w-16 h-16 rounded-xl mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-8 w-20 rounded-full" />
                    </div>
                ))}

                {!loading && historyData.map((item, index) => (
                    <motion.div
                        key={item.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
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
