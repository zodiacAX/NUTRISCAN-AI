import React from 'react';
import { Package, UtensilsCrossed, GitCompare, ArrowRight } from 'lucide-react';

interface QuickStartCardsProps {
  onSelectAction: (action: 'packaged' | 'cooked_meal' | 'compare') => void;
}

export const QuickStartCards: React.FC<QuickStartCardsProps> = ({ onSelectAction }) => {
  const cards = [
    {
      id: 'packaged' as const,
      title: 'Scan Packaged Food',
      description: 'Upload front packages, ingredients panels, or nutrition facts. Extract additives, allergens, and sugar density.',
      icon: <Package size={26} className="text-[#163D2B]" />,
      badge: 'OCR & Label Parser',
      bgColor: 'bg-white hover:border-[#163D2B]/40',
      actionText: 'Start package scan'
    },
    {
      id: 'cooked_meal' as const,
      title: 'Analyze a Cooked Meal',
      description: 'Snap your home-cooked dinner or bistro plate. Estimate portions, macro balance, and fresh vegetable ratios.',
      icon: <UtensilsCrossed size={26} className="text-[#3D7954]" />,
      badge: 'Portion & Macro AI',
      bgColor: 'bg-white hover:border-[#3D7954]/40',
      actionText: 'Analyze plate'
    },
    {
      id: 'compare' as const,
      title: 'Compare Two Products',
      description: 'Side-by-side comparison normalized per 100g or per serving. Compare sodium, sugar, and processing without biased scores.',
      icon: <GitCompare size={26} className="text-[#1D5B79]" />,
      badge: 'Normalized Metrics',
      bgColor: 'bg-white hover:border-[#1D5B79]/40',
      actionText: 'Open comparison'
    }
  ];

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#163D2B]">Quick Start Workflows</h2>
            <p className="text-sm text-[#68736B] mt-1">Choose an intelligence mode to begin inspecting your food</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => onSelectAction(card.id)}
              className={`p-6 rounded-2xl border border-[#E2E8E0] ${card.bgColor} shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group`}
              role="button"
              tabIndex={0}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F6F4E9] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E4F0E5] text-[#163D2B]">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1D2921] group-hover:text-[#163D2B] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#68736B] mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ECEEEA] flex items-center justify-between text-xs font-semibold text-[#163D2B] group-hover:text-[#3D7954]">
                <span>{card.actionText}</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
