import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, MapPin, Calendar, LayoutGrid, CheckCircle } from 'lucide-react';
import { dataManager } from '../firebase/dataManager';
import SEO from '../components/SEO';

// Before/After comparison slider component
function BeforeAfterSlider({ before, after, title }) {
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden select-none border border-gray-200">
      {/* Before Image */}
      <img src={before} alt="Before installation" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full z-20 shadow-md">
        Before
      </div>

      {/* After Image */}
      <div 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      >
        <img src={after} alt="After installation" className="w-full h-full object-cover" />
      </div>
      <div 
        className="absolute top-4 right-4 bg-green-600 text-white text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full z-20 shadow-md pointer-events-none"
        style={{ opacity: sliderPos > 20 ? 1 : 0 }}
      >
        After
      </div>

      {/* Divider Line & Handle */}
      <div 
        className="absolute inset-y-0 z-30 w-1 bg-white cursor-ew-resize flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-8 h-8 bg-white text-primary rounded-full shadow-lg border border-gray-300 flex items-center justify-center text-xs font-bold font-serif">
          ↔
        </div>
      </div>

      {/* Interactive Range Input overlay */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 z-40 cursor-ew-resize"
      />
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);

  const categories = ['All', 'Bathroom Designs', 'Kitchen Designs', 'Living Room', 'Commercial Projects', 'Outdoor'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProj = await dataManager.getProjects();
        setProjects(allProj);
      } catch (e) {
        console.error("Error fetching projects data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <SEO 
        title="Inspiration Gallery & Completed Projects" 
        description="See before/after installations, luxury bathroom renovations, and mosque tiling projects by Arshad Tiles."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-left mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Our Portfolio</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Inspiration Gallery</h1>
          <p className="text-sm text-gray-500 mt-2">Browse completed residential, commercial, and mosque tile installations.</p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-10 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-xs whitespace-nowrap border transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(n => (
              <div key={n} className="bg-white rounded-3xl h-[450px] animate-pulse border border-gray-200"></div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="bg-white p-5 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col gap-6">
                
                {/* Before/After comparison slider */}
                {proj.beforeImages && proj.beforeImages.length > 0 && proj.afterImages && proj.afterImages.length > 0 ? (
                  <BeforeAfterSlider 
                    before={proj.beforeImages[0]} 
                    after={proj.afterImages[0]} 
                    title={proj.title} 
                  />
                ) : (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img src={proj.afterImages?.[0] || '/logo-icon.png'} alt={proj.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Project details card */}
                <div className="text-left flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-dark">
                      {proj.category} - {proj.customerType}
                    </span>
                    <span className="text-xs font-bold text-primary bg-accent/20 px-2.5 py-0.5 rounded-md">
                      {proj.area}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-primary mb-3">
                    {proj.title}
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {proj.materialsUsed.map((mat, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg">
                        {mat}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>{proj.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>Completed: {proj.completionDate}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-3xl border border-gray-200/60 text-center max-w-md mx-auto">
            <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="font-serif text-lg font-bold text-primary">No Projects Found</h4>
            <p className="text-sm text-gray-400 mt-2">
              We haven't uploaded completed installation photos for the "{selectedCategory}" category yet. Stay tuned!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
