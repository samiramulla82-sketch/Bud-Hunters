import React, { useState, useEffect } from 'react';
import { Star, Search, Plus, Info, ExternalLink } from 'lucide-react';

const BudHunter = () => {
  const [strains, setStrains] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReview, setNewReview] = useState({
    strainName: '',
    rating: 5,
    review: '',
    effects: [],
    type: 'hybrid'
  });

  const effectOptions = ['Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Creative', 'Focused', 'Energetic', 'Sleepy', 'Hungry', 'Talkative'];
  const strainTypes = ['indica', 'sativa', 'hybrid'];

  useEffect(() => {
    loadStrains();
  }, []);

  const loadStrains = async () => {
    try {
      const result = await window.storage.get('bud-hunter-strains');
      if (result && result.value) {
        setStrains(JSON.parse(result.value));
      } else {
        const sampleStrains = [
          {
            id: 1,
            name: 'Blue Dream',
            type: 'hybrid',
            avgRating: 4.5,
            reviews: [
              { id: 1, rating: 5, text: 'Perfect balance of relaxation and energy!', effects: ['Happy', 'Relaxed', 'Creative'], date: '2026-01-20' }
            ]
          },
          {
            id: 2,
            name: 'Girl Scout Cookies',
            type: 'hybrid',
            avgRating: 4.7,
            reviews: [
              { id: 1, rating: 5, text: 'Amazing flavor and effects. Highly recommend!', effects: ['Euphoric', 'Relaxed', 'Happy'], date: '2026-01-19' }
            ]
          }
        ];
        setStrains(sampleStrains);
        await saveStrains(sampleStrains);
      }
    } catch (error) {
      console.log('Initializing with default data');
      setStrains([]);
    }
  };

  const saveStrains = async (strainsData) => {
    try {
      await window.storage.set('bud-hunter-strains', JSON.stringify(strainsData));
    } catch (error) {
      console.error('Error saving strains:', error);
    }
  };

  const addReview = async () => {
    if (!newReview.strainName || !newReview.review) return;

    const updatedStrains = [...strains];
    let strain = updatedStrains.find(s => s.name.toLowerCase() === newReview.strainName.toLowerCase());

    const review = {
      id: Date.now(),
      rating: newReview.rating,
      text: newReview.review,
      effects: newReview.effects,
      date: new Date().toISOString().split('T')[0]
    };

    if (strain) {
      strain.reviews.push(review);
      strain.avgRating = strain.reviews.reduce((sum, r) => sum + r.rating, 0) / strain.reviews.length;
    } else {
      strain = {
        id: Date.now(),
        name: newReview.strainName,
        type: newReview.type,
        avgRating: newReview.rating,
        reviews: [review]
      };
      updatedStrains.push(strain);
    }

    setStrains(updatedStrains);
    await saveStrains(updatedStrains);
    setShowAddModal(false);
    setNewReview({ strainName: '', rating: 5, review: '', effects: [], type: 'hybrid' });
  };

  const filteredStrains = strains.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWikiLink = (strainName) => {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(strainName.replace(/ /g, '_'))}_(cannabis)`;
  };

  const getLeaflyLink = (strainName) => {
    return `https://www.leafly.com/strains/${encodeURIComponent(strainName.toLowerCase().replace(/ /g, '-'))}`;
  };

  const getSeedfinderLink = (strainName) => {
    return `https://en.seedfinder.eu/strain-info/${encodeURIComponent(strainName.replace(/ /g, '_'))}/`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-green-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            🌿 Bud Hunter
          </h1>
          <p className="mt-2 text-green-100">Community-driven cannabis strain ratings and reviews</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search strains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition"
          >
            <Plus size={20} />
            Add Review
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Info size={24} className="text-green-600" />
            Educational Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="https://www.leafly.com/learn/cannabis-101/cannabis-strains" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-700 hover:text-green-900 p-3 bg-green-50 rounded-lg transition">
              <ExternalLink size={18} />
              <span>Leafly - Strain Guide</span>
            </a>
            <a href="https://www.wikileaf.com/thestash/cannabis-strains/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-700 hover:text-green-900 p-3 bg-green-50 rounded-lg transition">
              <ExternalLink size={18} />
              <span>WikiLeaf - Strain Database</span>
            </a>
            <a href="https://en.seedfinder.eu/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-700 hover:text-green-900 p-3 bg-green-50 rounded-lg transition">
              <ExternalLink size={18} />
              <span>SeedFinder - Strain Info</span>
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrains.map(strain => (
            <div key={strain.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">{strain.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  strain.type === 'indica' ? 'bg-purple-100 text-purple-700' :
                  strain.type === 'sativa' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {strain.type}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(strain.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-semibold">{strain.avgRating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({strain.reviews.length} reviews)</span>
              </div>

              <div className="space-y-3 mb-4">
                {strain.reviews.slice(0, 2).map(review => (
                  <div key={review.id} className="border-l-4 border-green-500 pl-3 py-1">
                    <p className="text-gray-700 text-sm">{review.text}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {review.effects.map(effect => (
                        <span key={effect} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <a href={getLeaflyLink(strain.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm">
                  <ExternalLink size={16} />
                  View on Leafly
                </a>
                <a href={getSeedfinderLink(strain.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm">
                  <ExternalLink size={16} />
                  SeedFinder Info
                </a>
                <a href={getWikiLink(strain.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm">
                  <ExternalLink size={16} />
                  Wikipedia
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredStrains.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No strains found. Be the first to add a review!</p>
          </div>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add Review</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Strain Name</label>
                <input
                  type="text"
                  value={newReview.strainName}
                  onChange={(e) => setNewReview({...newReview, strainName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="e.g., Blue Dream"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type</label>
                <select
                  value={newReview.type}
                  onChange={(e) => setNewReview({...newReview, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                >
                  {strainTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Rating: {newReview.rating}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Effects</label>
                <div className="flex flex-wrap gap-2">
                  {effectOptions.map(effect => (
                    <button
                      key={effect}
                      onClick={() => {
                        const effects = newReview.effects.includes(effect)
                          ? newReview.effects.filter(e => e !== effect)
                          : [...newReview.effects, effect];
                        setNewReview({...newReview, effects});
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newReview.effects.includes(effect)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Review</label>
                <textarea
                  value={newReview.review}
                  onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addReview}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Submit Review
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-green-800 text-white mt-16 py-8 relative">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">🌿 Bud Hunter - Your Community Cannabis Resource</p>
          <p className="text-green-200 text-sm">Please consume responsibly and in accordance with local laws.</p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a href="https://www.leafly.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-200">Leafly</a>
            <a href="https://www.wikileaf.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-200">WikiLeaf</a>
            <a href="https://en.seedfinder.eu" target="_blank" rel="noopener noreferrer" className="hover:text-green-200">SeedFinder</a>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-green-300 text-xs opacity-70">
          Created by Samir Mulla
        </div>
      </footer>
    </div>
  );
};

export default BudHunter;