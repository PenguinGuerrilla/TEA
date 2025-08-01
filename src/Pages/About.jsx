import Navbar from '@/Components/Navbar';
import React from 'react';
import { FaDatabase, FaQuestion, FaCode} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const About = () => {
    const navigate = useNavigate();


    const Card = ({ icon, title, children }) => (
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-indigo-500/20 transition-shadow duration-300 flex flex-col h-[450px]">
            <div className="flex items-center gap-4 mb-4 flex-shrink-0">
                {icon}
                <h2 className="text-3xl font-bold text-white">{title}</h2>
            </div>
            <div className="overflow-y-auto pr-4 custom-scrollbar">
                <p className="text-gray-300 leading-relaxed text-lg">
                    {children}
                </p>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <div className="text-center mb-20">
                    <h1 className="text-6xl font-extrabold text-white tracking-tight">
                        About The Exomoon Archive
                    </h1>
                    <p className="text-xl text-gray-400 mt-4 max-w-3xl mx-auto">
                        A centralized resource for the scientific community to advance the search for moons beyond our solar system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20" style={{ fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
                    <Card icon={<FaDatabase className="w-10 h-10 text-indigo-400" />} title="The Project">
                        The Exomoon Archive (TEA) aims to create a comprehensive dataset of exoplanets discussed in exomoon research, taking into account their potential as exomoon hosts.
                        The primary objective is to gather the largest possible collection of exoplanets that could potentially host exomoons mentioned
                        in the scientific literature on exomoons. It is important to note that while many
                        of these planets have been dismissed as potential exomoon hosts, they were included to ensure a thorough and exhaustive dataset.
                    </Card>
                    <Card icon={<FaQuestion className="w-10 h-10 text-indigo-400" />} title="Why TEA Exists">
                        The impetus for creating TEA was the necessity of performing a statistical analysis on exoplanets referenced within the scientific
                        literature on as potential exomoon hosts. Specifically, the objective was to determine which exoplanetary characteristics are most
                        frequently correlated with the potential for hosting a moon. This line of inquiry was unfeasible due to the lack of a consolidated
                        dataset of known exomoon candidates. Consequently, TEA was developed to fill this void and establish a robust foundation for
                        subsequent research in the field.          </Card>
                    <Card icon={<FaCode className="w-10 h-10 text-indigo-400" />} title="How TEA Was Made">
                        Firstly, scientific article databases and search engines, like Scispace, were used to search for articles and publications based on key words such as “exomoons”,
                        “extrasolar moons”, “natural satellites”, and so on. Since the objective of this archive is to create the most comprehensive exomoon candidate dataset possible,
                        the selected articles explored different types of exoplanets, for example hot planes with a small orbital period, and Jupiter-like massive planets.
                        Furthermore a range of exomoon detection techniques were also explored by different articles, like the transit method, that is, direct photometric observations of
                        transiting exoplanets, the observation of dynamic effects such as Transit Timing Variations (TTV), Orbital Sampling
                        Effects (OSE), and detection of planet moon interaction signatures.
                        With a list of selected articles a list of exoplanets that have been analyzed as possible exomoon hosts was elaborated and used to search the NASA Exoplanet Archive
                    </Card>
                </div>

                <div className="text-center mb-20">
                    <h2 className="text-5xl font-bold text-white">Explore the Data</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Cumulative Kepler Data</h2>
                        <p className="text-gray-400 mb-4" style={{ fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
                            This section provides data for the exoplanets observed by the Kepler telescope on the Nasa Exoplanet Archive.
                        </p>
                        <a style={{cursor: "pointer"}} onClick={() => navigate('/ps')} className="text-blue-400 hover:underline">View Cumulative Data</a>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Planetary Systems Data</h2>
                        <p className="text-gray-400 mb-4" style={{ fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
                            This section provides data for the exoplanets that could not be find in the Nasa Exoplanet Archive's cumulative kepler database.
                        </p>
                        <a onClick={() => navigate('/ps')} style={{cursor: "pointer"}} className="text-blue-400 hover:underline">View Planetary Systems Data</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
