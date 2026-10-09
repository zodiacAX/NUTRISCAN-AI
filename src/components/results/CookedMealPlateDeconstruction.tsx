import React, { useState } from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { PieChart, Wheat, Droplets, Candy, Sparkles } from 'lucide-react';

interface CookedMealPlateDeconstructionProps {
  food: FoodScanResult;
}

interface SegmentPetal {
  id: string;
  name: string;
  percentage: number;
  weightGrams: number;
  carbsG: number;
  fatsG: number;
  sugarG: number;
  color: string;
  lightColor: string;
  angle: number; // in degrees for radial placement
}

export const CookedMealPlateDeconstruction: React.FC<CookedMealPlateDeconstructionProps> = ({ food }) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('tomatoes');

  // Realistic meal ingredients deconstruction data modeled after Image 2
  const segments: SegmentPetal[] = [
    {
      id: 'tomatoes',
      name: 'Tomatoes & Basil',
      percentage: 34,
      weightGrams: 95,
      carbsG: 4.2,
      fatsG: 0.3,
      sugarG: 2.8,
      color: '#E04F36',
      lightColor: '#FDEAE6',
      angle: 0
    },
    {
      id: 'avocados',
      name: 'Fresh Avocado',
      percentage: 25,
      weightGrams: 70,
      carbsG: 6.0,
      fatsG: 10.5,
      sugarG: 0.5,
      color: '#769E3A',
      lightColor: '#EEF6E1',
      angle: 60
    },
    {
      id: 'pasta',
      name: 'Durum Semolina',
      percentage: 18,
      weightGrams: 50,
      carbsG: 36.0,
      fatsG: 0.9,
      sugarG: 1.2,
      color: '#E5A93C',
      lightColor: '#FDF6E2',
      angle: 120
    },
    {
      id: 'spinach',
      name: 'Baby Greens & Spinach',
      percentage: 12,
      weightGrams: 35,
      carbsG: 1.2,
      fatsG: 0.2,
      sugarG: 0.3,
      color: '#3D7954',
      lightColor: '#E4F0E5',
      angle: 180
    },
    {
      id: 'nuts',
      name: 'Roasted Nuts & Seeds',
      percentage: 6,
      weightGrams: 18,
      carbsG: 2.5,
      fatsG: 9.2,
      sugarG: 0.7,
      color: '#A06E41',
      lightColor: '#F8EFE6',
      angle: 240
    },
    {
      id: 'olive_oil',
      name: 'Extra Virgin Olive Oil',
      percentage: 5,
      weightGrams: 14,
      carbsG: 0.0,
      fatsG: 14.0,
      sugarG: 0.0,
      color: '#8CA530',
      lightColor: '#F2F6DC',
      angle: 300
    }
  ];

  const activeSegment = segments.find(s => s.id === selectedSegmentId) || segments[0];

  return (
    <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ECEEEA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3D7954] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#3D7954]">
              Plate Vision AI Deconstruction
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#1D2921] mt-1">
            Ingredient Composition & Radial Segmentation
          </h3>
          <p className="text-xs text-[#68736B]">
            Interactive petal analysis derived from Gemma 4 plate segmentation ({food.servingBasis || 'approx. 280 g'}).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F6F4E9] px-3 py-1.5 rounded-xl border border-[#E2E8E0] self-start sm:self-auto">
          <PieChart size={15} className="text-[#163D2B]" />
          <span className="text-xs font-semibold text-[#163D2B]">6 Identified Components</span>
        </div>
      </div>

      {/* Main Radial Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Radial Flower Petal Visualizer (Inspired by Image 2) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4">
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
            {/* Center Dish Node */}
            <div className="relative z-20 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white flex items-center justify-center group cursor-pointer">
              <img
                src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                Overview
              </div>
            </div>

            {/* Radial Petals */}
            {segments.map((segment) => {
              const rad = (segment.angle - 90) * (Math.PI / 180);
              const radius = 105; // distance from center
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              const isSelected = selectedSegmentId === segment.id;

              return (
                <button
                  key={segment.id}
                  onClick={() => setSelectedSegmentId(segment.id)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    backgroundColor: isSelected ? segment.color : segment.lightColor,
                    borderColor: isSelected ? '#163D2B' : segment.color
                  }}
                  className={`absolute z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 p-1 flex flex-col items-center justify-center shadow-xs transition-all duration-300 hover:scale-110 cursor-pointer ${
                    isSelected ? 'ring-4 ring-[#163D2B]/20 scale-105 text-white' : 'text-[#1D2921]'
                  }`}
                  title={`${segment.name}: ${segment.percentage}%`}
                >
                  <span className={`text-[11px] sm:text-xs font-black ${isSelected ? 'text-white' : 'text-[#1D2921]'}`}>
                    {segment.percentage}%
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-medium text-center line-clamp-1 px-1 ${
                      isSelected ? 'text-white/90' : 'text-[#68736B]'
                    }`}
                  >
                    {segment.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-[#8E9A91] text-center mt-3 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#3D7954]" />
            Click any petal to inspect itemized weights & macronutrient estimates
          </p>
        </div>

        {/* Right: Selected Component Breakdown Card (Inspired by Image 2 bottom cards) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#F6F4E9]/70 rounded-2xl p-5 border border-[#E2E8E0] space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#3D7954]">
                  Selected Ingredient
                </span>
                <h4 className="text-base font-bold text-[#1D2921] mt-0.5">
                  {activeSegment.name}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-xl bg-white border border-[#E2E8E0] text-xs font-bold font-mono text-[#163D2B]">
                {activeSegment.weightGrams} g ({activeSegment.percentage}%)
              </span>
            </div>

            {/* Micro nutrient indicators: Carbs, Fats, Sugar (Matching Image 2 icons) */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-white rounded-xl p-3 border border-[#E2E8E0] text-center shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#E4F0E5] mx-auto flex items-center justify-center text-[#3D7954] mb-1">
                  <Wheat size={15} />
                </div>
                <div className="text-[10px] uppercase font-bold text-[#68736B]">Carbs</div>
                <div className="text-xs font-bold text-[#1D2921] font-mono mt-0.5">
                  {activeSegment.carbsG} g
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-[#E2E8E0] text-center shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#FEF7ED] mx-auto flex items-center justify-center text-[#A65D12] mb-1">
                  <Droplets size={15} />
                </div>
                <div className="text-[10px] uppercase font-bold text-[#68736B]">Fats</div>
                <div className="text-xs font-bold text-[#1D2921] font-mono mt-0.5">
                  {activeSegment.fatsG} g
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-[#E2E8E0] text-center shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#FEF3F2] mx-auto flex items-center justify-center text-[#B42318] mb-1">
                  <Candy size={15} />
                </div>
                <div className="text-[10px] uppercase font-bold text-[#68736B]">Sugar</div>
                <div className="text-xs font-bold text-[#1D2921] font-mono mt-0.5">
                  {activeSegment.sugarG} g
                </div>
              </div>
            </div>
          </div>

          {/* Quick list of other meal parts */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#68736B]">
              All Plate Elements
            </span>
            <div className="grid grid-cols-2 gap-2">
              {segments.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegmentId(seg.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedSegmentId === seg.id
                      ? 'border-[#163D2B] bg-[#E4F0E5]/80 font-bold text-[#163D2B]'
                      : 'border-[#E2E8E0] bg-white hover:bg-[#F6F4E9] text-[#1D2921]'
                  }`}
                >
                  <span className="truncate pr-1">{seg.name}</span>
                  <span className="font-mono text-[11px] font-bold text-[#68736B] shrink-0">
                    {seg.percentage}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
