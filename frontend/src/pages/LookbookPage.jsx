import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

const LookbookPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await api.get('/lookbook/stories');
        setStories(data.stories || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
          Editorial Portfolio
        </span>
        <h1 className="text-4xl sm:text-5xl font-logo font-normal tracking-tight">
          Spring–Summer 26 Lookbook
        </h1>
        <p className="text-sm text-neutral-600 font-light">
          Short summers invite lightness and movement. Explore our campaign captured amidst the heritage architectures of Sikar and Rajasthan.
        </p>
      </div>

      {/* Editorial Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-neutral-100 rounded" />
          <div className="aspect-square bg-neutral-100 rounded" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {stories.map((story, idx) => (
            <div key={idx} className="group flex flex-col space-y-4">
              <div className="aspect-[4/3] bg-neutral-100 overflow-hidden rounded shadow-sm">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                    {story.subtitle}
                  </span>
                  <h3 className="text-xl font-logo font-normal mt-1 text-black group-hover:underline">
                    {story.title}
                  </h3>
                </div>
                {story.linkUrl && (
                  <Link
                    to={story.linkUrl}
                    className="text-xs uppercase font-semibold tracking-wider border-b border-black pb-0.5 whitespace-nowrap"
                  >
                    {story.linkText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-neutral-900 text-white p-12 rounded-lg text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-logo font-normal">
          Ready to Experience the Collection?
        </h3>
        <p className="text-sm text-neutral-300 max-w-md mx-auto">
          Shop our performance half tights, heavyweight organic cotton tops, and Canadian winter crewnecks.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-white text-black px-8 py-3.5 rounded text-xs uppercase font-semibold tracking-widest hover:bg-neutral-200 transition-colors"
        >
          Explore Catalog
        </Link>
      </div>

    </div>
  );
};

export default LookbookPage;
