import React from 'react';
import { X } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-xl rounded-lg shadow-2xl p-6 md:p-8 z-10 animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div>
            <h3 className="text-lg font-semibold tracking-tight font-logo">
              MS Collection Size & Fit Guide
            </h3>
            <p className="text-xs text-neutral-500">
              Measurements are in inches (chest / waist / hips)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 text-xs uppercase tracking-wider text-neutral-600 bg-neutral-50">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest (in)</th>
                  <th className="py-2.5 px-3">Waist (in)</th>
                  <th className="py-2.5 px-3">Half Tights Inseam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs">
                <tr>
                  <td className="py-3 px-3 font-semibold">XS</td>
                  <td className="py-3 px-3">34 - 36</td>
                  <td className="py-3 px-3">28 - 29</td>
                  <td className="py-3 px-3">9.0"</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">S</td>
                  <td className="py-3 px-3">36 - 38</td>
                  <td className="py-3 px-3">30 - 31</td>
                  <td className="py-3 px-3">9.5"</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">M</td>
                  <td className="py-3 px-3">38 - 40</td>
                  <td className="py-3 px-3">32 - 33</td>
                  <td className="py-3 px-3">10.0"</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">L</td>
                  <td className="py-3 px-3">40 - 42</td>
                  <td className="py-3 px-3">34 - 35</td>
                  <td className="py-3 px-3">10.5"</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">XL</td>
                  <td className="py-3 px-3">42 - 44</td>
                  <td className="py-3 px-3">36 - 37</td>
                  <td className="py-3 px-3">11.0"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-neutral-50 p-4 rounded text-xs space-y-2 text-neutral-700">
            <p className="font-semibold">Fit Recommendations:</p>
            <p>
              • <strong>Tops (Longsleeves & Tees):</strong> Cut for an athletic, slightly relaxed fit. If between sizes, size up for a roomier drape.
            </p>
            <p>
              • <strong>St-Ambroise Half Tights:</strong> High compression Italian fabric. True to size for race day compression; size up if you prefer moderate support.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-black text-white px-6 py-2.5 rounded text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
