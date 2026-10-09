import type { FoodScanResult } from '../types/nutrition';

export const SAMPLE_FOODS: FoodScanResult[] = [
  {
    id: 'sample-nature-valley',
    name: "Nature Valley Crunchy Granola Bars",
    brand: "Nature Valley / General Mills",
    category: "Snack & Granola Bars",
    scanType: "packaged",
    timestamp: "2026-10-09T10:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    status: "analyzed",
    confidenceScore: 0.96,
    servingBasis: "per 2 bars (42 g)",
    servingSizeGrams: 42,
    servingsPerContainer: 6,
    isDemoSample: true,
    nutrition: {
      calories: {
        value: 190,
        unit: 'kcal',
        provenance: 'extracted_label',
        confidence: 0.98,
        dailyValuePercentage: 10,
        sourceNote: "Verified from back nutrition facts panel line 1"
      },
      protein: {
        value: 3,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.95,
        dailyValuePercentage: 6,
        sourceNote: "Extracted: Protein 3g"
      },
      carbohydrates: {
        value: 29,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.98,
        dailyValuePercentage: 11,
        sourceNote: "Extracted: Total Carbohydrate 29g"
      },
      totalSugar: {
        value: 11,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.97,
        dailyValuePercentage: 22,
        sourceNote: "Extracted: Total Sugars 11g (Includes 11g Added Sugars, 22% DV)"
      },
      addedSugar: {
        value: 11,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.97,
        dailyValuePercentage: 22,
        sourceNote: "Extracted: Includes 11g Added Sugars"
      },
      totalFat: {
        value: 7,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.96,
        dailyValuePercentage: 9,
        sourceNote: "Extracted: Total Fat 7g"
      },
      saturatedFat: {
        value: 1,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.94,
        dailyValuePercentage: 5,
        sourceNote: "Extracted: Saturated Fat 1g"
      },
      dietaryFiber: {
        value: 2,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.93,
        dailyValuePercentage: 7,
        sourceNote: "Extracted: Dietary Fiber 2g"
      },
      sodium: {
        value: 140,
        unit: 'mg',
        provenance: 'extracted_label',
        confidence: 0.97,
        dailyValuePercentage: 6,
        sourceNote: "Extracted: Sodium 140mg"
      },
      iron: {
        value: 0.9,
        unit: 'mg',
        provenance: 'extracted_label',
        confidence: 0.88,
        dailyValuePercentage: 6,
        sourceNote: "Extracted: Iron 0.9mg"
      }
    },
    interpretation: {
      keyTakeaways: [
        {
          title: "High Added Sugar Density",
          description: "11g of sugar per 42g serving means over 26% of this bar by weight is sugar. Provides 22% of daily recommended added sugar limit in one snack.",
          sentiment: "warning",
          metricTag: "11g Sugar (22% DV)"
        },
        {
          title: "Low Saturated Fat & Moderate Sodium",
          description: "Contains only 1g saturated fat and 140mg sodium, which is modest for commercial packaged baked snacks.",
          sentiment: "positive",
          metricTag: "1g Sat Fat / 140mg Na"
        },
        {
          title: "Modest Protein & Fiber",
          description: "Provides 3g protein and 2g fiber. While whole grain oats are the primary ingredient, the energetic density comes predominantly from carbohydrates and added sweeteners.",
          sentiment: "neutral",
          metricTag: "3g Protein / 2g Fiber"
        }
      ],
      processingLevel: {
        novaGroup: 4,
        label: "Ultra-Processed Food (Nova 4)",
        explanation: "Formulated with industrially extracted ingredients including canola oil, soy lecithin, and refined sugar syrups alongside whole rolled oats.",
        markers: ["Canola Oil", "Soy Lecithin (Emulsifier)", "Refined Sugar Syrup", "Baking Soda"]
      },
      dietarySuitability: {
        vegetarian: true,
        vegan: false,
        glutenFree: false,
        dairyFree: true,
        ketoFriendly: false
      }
    },
    ingredientsAnalysis: {
      rawExtractedText: "WHOLE GRAIN OATS, SUGAR, CANOLA OIL, RICE FLOUR, HONEY, BROWN SUGAR SYRUP, SALT, BAKING SODA, SOY LECITHIN, NATURAL FLAVOR. CONTAINS SOY; MAY CONTAIN ALMOND, PEANUT AND PECAN INGREDIENTS.",
      extractedIngredients: [
        { name: "Whole Grain Oats", purpose: "Primary grain base", isAdditive: false, riskLevel: 'safe', description: "Unrefined oats providing complex carbohydrates and beta-glucan fiber." },
        { name: "Sugar", purpose: "Sweetener", isAdditive: false, riskLevel: 'caution', description: "Refined caloric sweetener. High consumption correlates with dental caries and metabolic spikes." },
        { name: "Canola Oil", purpose: "Fat source & crisp texture", isAdditive: false, riskLevel: 'safe', description: "Vegetable oil rich in monounsaturated fats and alpha-linolenic acid (omega-3)." },
        { name: "Rice Flour", purpose: "Binding & crunch", isAdditive: false, riskLevel: 'safe', description: "Milled rice used for coating and crispness." },
        { name: "Honey", purpose: "Flavor and humectant", isAdditive: false, riskLevel: 'safe', description: "Natural sweetener adding characteristic aroma and moisture binding." },
        { name: "Brown Sugar Syrup", purpose: "Sweetener and color", isAdditive: false, riskLevel: 'caution', description: "Refined sugar with residual molasses for coloring." },
        { name: "Salt", purpose: "Flavor enhancer", isAdditive: false, riskLevel: 'safe', description: "Sodium chloride used for flavor balancing." },
        { name: "Baking Soda", purpose: "Leavening agent", isAdditive: true, riskLevel: 'safe', description: "Sodium bicarbonate (E500ii). Creates airy crumb structure." },
        { name: "Soy Lecithin", purpose: "Emulsifier", isAdditive: true, riskLevel: 'safe', description: "Phospholipid (E322) facilitating oil and moisture dispersion.", sourceECode: "E322" },
        { name: "Natural Flavor", purpose: "Aroma enhancer", isAdditive: true, riskLevel: 'safe', description: "Plant-derived aromatic flavoring compounds." }
      ],
      declaredAllergens: ["Soy"],
      crossContaminationWarnings: ["Almonds", "Peanuts", "Pecans"],
      allergenCautionMessage: "Always verify the original packaging. AI extraction may miss allergens.",
      unreadableSections: []
    },
    foodSafety: {
      dateType: "best_before",
      dateExtracted: "18 NOV 2026",
      dateRawSnippet: "BB 18NOV26 04:12 CT2",
      isDateAmbiguous: false,
      storageInstructions: "Store in a cool, dry pantry away from direct sunlight.",
      packagingIntegrityNotes: "Individually sealed dual-bar pouch intact.",
      recallStatus: {
        checked: true,
        hasRecalls: false,
        source: "FDA / USDA Enforcement Database",
        details: "No active recalls identified for Nature Valley Oats 'n Honey batch CT2."
      },
      safetyDisclaimer: "Photographs alone cannot determine microbiological safety or contamination."
    },
    evidenceItems: [
      {
        id: 'ev-1',
        claim: "Calories: 190 kcal per 42g serving",
        provenance: 'extracted_label',
        extractedSnippet: "Nutrition Facts | Serving size 2 bars (42g) | Calories 190",
        locationOnPackage: "Back panel, Nutrition Facts table header",
        externalSource: { name: "Open Food Facts", referenceId: "0016000264648", url: "https://world.openfoodfacts.org/product/0016000264648" }
      },
      {
        id: 'ev-2',
        claim: "Total Sugars: 11g (including 11g added sugars)",
        provenance: 'extracted_label',
        extractedSnippet: "Total Sugars 11g | Incl. 11g Added Sugars 22%",
        locationOnPackage: "Back panel, Nutrition Facts line 8",
        externalSource: { name: "USDA FoodData Central", referenceId: "FDC ID 2108174" }
      },
      {
        id: 'ev-3',
        claim: "Contains Soy allergen; cross-contact warning for tree nuts and peanuts",
        provenance: 'extracted_label',
        extractedSnippet: "CONTAINS SOY; MAY CONTAIN ALMOND, PEANUT AND PECAN INGREDIENTS.",
        locationOnPackage: "Directly beneath ingredients paragraph",
        externalSource: { name: "Label OCR Text Section 3", referenceId: "OCR-CONF-98" }
      },
      {
        id: 'ev-4',
        claim: "Best Before Date: 18 NOV 2026",
        provenance: 'extracted_label',
        extractedSnippet: "BB 18NOV26 04:12 CT2 stamped on flap",
        locationOnPackage: "Carton top flap laser stamp"
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: "Account for 2-Bar Portions",
        action: "Each pouch contains 2 bars totaling 190 calories and 11g sugar. If you only eat 1 bar, divide values by two.",
        rationale: "Many consumers assume the label represents 1 bar, undercounting sugar consumption.",
        iconType: "portion"
      },
      {
        id: 'rec-2',
        title: "Compare with Low-Sugar Alternatives",
        action: "Look for whole grain bars containing under 5g of added sugar per serving or naturally sweetened with whole fruit dates.",
        rationale: "Helps maintain sustained energy levels without insulin spikes.",
        iconType: "compare"
      },
      {
        id: 'rec-3',
        title: "Verify Nut Allergy Warnings",
        action: "Individuals with severe peanut or tree nut anaphylaxis should exercise extreme caution due to shared equipment lines.",
        rationale: "Advisory warnings indicate trace cross-contact potential.",
        iconType: "check"
      }
    ],
    suggestedQuestions: [
      "Why is this classified as Nova 4 Ultra-processed?",
      "How much sugar is in just one bar?",
      "Is this snack suitable for someone with a peanut allergy?",
      "What is soy lecithin and why is it added?"
    ]
  },
  {
    id: 'sample-dang-coconut',
    name: "Dang Toasted Coconut Chips",
    brand: "Dang Foods Co.",
    category: "Fruit & Plant Snacks",
    scanType: "packaged",
    timestamp: "2026-10-09T09:42:00Z",
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    status: "analyzed",
    confidenceScore: 0.94,
    servingBasis: "per 1 oz (30 g)",
    servingSizeGrams: 30,
    servingsPerContainer: 3.5,
    isDemoSample: true,
    nutrition: {
      calories: {
        value: 180,
        unit: 'kcal',
        provenance: 'extracted_label',
        confidence: 0.97,
        dailyValuePercentage: 9,
        sourceNote: "Extracted from Dang original pouch label"
      },
      protein: {
        value: 1,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.94,
        dailyValuePercentage: 2,
        sourceNote: "Extracted: Protein 1g"
      },
      carbohydrates: {
        value: 11,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.96,
        dailyValuePercentage: 4,
        sourceNote: "Extracted: Total Carb 11g"
      },
      totalSugar: {
        value: 8,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.95,
        dailyValuePercentage: 16,
        sourceNote: "Extracted: Total Sugars 8g"
      },
      addedSugar: {
        value: 6,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.93,
        dailyValuePercentage: 12,
        sourceNote: "Extracted: Includes 6g Added Sugars from cane sugar"
      },
      totalFat: {
        value: 15,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.98,
        dailyValuePercentage: 19,
        sourceNote: "Extracted: Total Fat 15g"
      },
      saturatedFat: {
        value: 13,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.97,
        dailyValuePercentage: 65,
        sourceNote: "Extracted: Saturated Fat 13g (65% DV)"
      },
      dietaryFiber: {
        value: 3,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.92,
        dailyValuePercentage: 11,
        sourceNote: "Extracted: Dietary Fiber 3g"
      },
      sodium: {
        value: 115,
        unit: 'mg',
        provenance: 'extracted_label',
        confidence: 0.96,
        dailyValuePercentage: 5,
        sourceNote: "Extracted: Sodium 115mg"
      }
    },
    interpretation: {
      keyTakeaways: [
        {
          title: "High Saturated Fat Concentration",
          description: "Contains 13g of saturated fat (65% of your recommended daily value) per 30g serving, naturally sourced from whole coconut copra.",
          sentiment: "warning",
          metricTag: "13g Sat Fat (65% DV)"
        },
        {
          title: "Clean Minimal Ingredient Profile",
          description: "Made with only 3 whole ingredients: coconut, cane sugar, and sea salt. Free of artificial colors, emulsifiers, or preservatives.",
          sentiment: "positive",
          metricTag: "Only 3 Ingredients"
        },
        {
          title: "Low Sodium Impact",
          description: "Only 115mg sodium per serving (5% DV), significantly lower than standard commercial potato or corn chips.",
          sentiment: "positive",
          metricTag: "115mg Sodium (5% DV)"
        }
      ],
      processingLevel: {
        novaGroup: 3,
        label: "Processed Food (Nova 3)",
        explanation: "Made by combining whole food (sliced coconut flesh) with culinary ingredients (cane sugar, salt) and oven toasted. Not ultra-processed.",
        markers: ["Sliced Coconut", "Cane Sugar", "Sea Salt"]
      },
      dietarySuitability: {
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        dairyFree: true,
        ketoFriendly: false
      }
    },
    ingredientsAnalysis: {
      rawExtractedText: "INGREDIENTS: COCONUT, CANE SUGAR, SEA SALT. CONTAINS TREE NUTS (COCONUT). PRODUCED ON SHARED EQUIPMENT WITH MILK AND PEANUTS.",
      extractedIngredients: [
        { name: "Coconut", purpose: "Base fruit flesh", isAdditive: false, riskLevel: 'safe', description: "Thinly sliced, toasted mature coconut copra supplying medium-chain triglycerides (MCTs)." },
        { name: "Cane Sugar", purpose: "Sweetening & caramelization", isAdditive: false, riskLevel: 'caution', description: "Crystallized evaporated sugarcane juice." },
        { name: "Sea Salt", purpose: "Flavor seasoning", isAdditive: false, riskLevel: 'safe', description: "Evaporated mineral sea salt." }
      ],
      declaredAllergens: ["Tree Nuts (Coconut)"],
      crossContaminationWarnings: ["Milk", "Peanuts"],
      allergenCautionMessage: "Always verify the original packaging. AI extraction may miss allergens.",
      unreadableSections: []
    },
    foodSafety: {
      dateType: "best_before",
      dateExtracted: "04 APR 2027",
      dateRawSnippet: "EXP 04APR27 L9240",
      isDateAmbiguous: false,
      storageInstructions: "Store in a cool dry place. Reseal tightly after opening to maintain crunch.",
      packagingIntegrityNotes: "Foil moisture-barrier pouch with zip-lock.",
      recallStatus: {
        checked: true,
        hasRecalls: false,
        source: "FDA Consumer Notification Registry",
        details: "No recall notices active for Dang coconut chips."
      },
      safetyDisclaimer: "Photographs alone cannot determine microbiological safety or contamination."
    },
    evidenceItems: [
      {
        id: 'ev-c1',
        claim: "Saturated Fat: 13g per 30g serving (65% DV)",
        provenance: 'extracted_label',
        extractedSnippet: "Saturated Fat 13g 65% Daily Value",
        locationOnPackage: "Rear pouch nutrition panel line 4",
        externalSource: { name: "Open Food Facts", referenceId: "859923005018", url: "https://world.openfoodfacts.org/product/0859923005018" }
      },
      {
        id: 'ev-c2',
        claim: "Ingredient list contains only 3 items",
        provenance: 'extracted_label',
        extractedSnippet: "INGREDIENTS: COCONUT, CANE SUGAR, SEA SALT.",
        locationOnPackage: "Pouch lower reverse side",
        externalSource: { name: "Label Text OCR Inspection", referenceId: "OCR-BOX-02" }
      }
    ],
    recommendations: [
      {
        id: 'rec-c1',
        title: "Mind the High Saturated Fat Density",
        action: "If you monitor cardiovascular lipid markers, enjoy this as a measured portion (1-2 tablespoons) rather than eating the full 3.5-serving bag.",
        rationale: "A full bag delivers over 45g of saturated fat (225% of the daily recommended limit).",
        iconType: "portion"
      },
      {
        id: 'rec-c2',
        title: "Check Coconut Botanical Classification",
        action: "While FDA classifies coconut as a tree nut, botanical coconut allergies are distinct from walnut/cashew allergies. Verify with your physician.",
        rationale: "Prevents unnecessary dietary exclusion while staying safe.",
        iconType: "check"
      }
    ],
    suggestedQuestions: [
      "Is the high saturated fat in coconut different from animal fat?",
      "Does this snack contain any artificial additives?",
      "Can someone with a peanut allergy safely eat this?",
      "How does this compare to potato chips in sodium?"
    ]
  },
  {
    id: 'sample-pasta-salad',
    name: "Artisan Tomato Basil Pasta & Garden Salad",
    brand: "Cooked Meal (Home / Bistro Prepared)",
    category: "Fresh Cooked Meals",
    scanType: "cooked_meal",
    timestamp: "2026-10-09T08:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    status: "estimated",
    confidenceScore: 0.88,
    servingBasis: "estimated portion (350 g)",
    servingSizeGrams: 350,
    isDemoSample: true,
    nutrition: {
      calories: {
        value: 520,
        unit: 'kcal',
        provenance: 'estimated_ai',
        confidence: 0.86,
        dailyValuePercentage: 26,
        sourceNote: "Estimated from computer vision volumetric segmentation of pasta and dressing"
      },
      protein: {
        value: 22,
        unit: 'g',
        provenance: 'estimated_ai',
        confidence: 0.84,
        dailyValuePercentage: 44,
        sourceNote: "Estimated based on lean ground beef ragù and parmesan topping"
      },
      carbohydrates: {
        value: 64,
        unit: 'g',
        provenance: 'estimated_ai',
        confidence: 0.87,
        dailyValuePercentage: 23,
        sourceNote: "Estimated based on ~180g cooked semolina spaghetti"
      },
      totalSugar: {
        value: 7,
        unit: 'g',
        provenance: 'estimated_ai',
        confidence: 0.82,
        dailyValuePercentage: 14,
        sourceNote: "Naturally occurring sugars from cooked crushed tomatoes and carrots"
      },
      totalFat: {
        value: 18,
        unit: 'g',
        provenance: 'estimated_ai',
        confidence: 0.81,
        dailyValuePercentage: 23,
        sourceNote: "Derived from olive oil dressing, cheese, and lean meat blend"
      },
      saturatedFat: {
        value: 5.5,
        unit: 'g',
        provenance: 'estimated_ai',
        confidence: 0.79,
        dailyValuePercentage: 28,
        sourceNote: "Derived from grated aged cheese and beef content"
      },
      dietaryFiber: {
        value: 5,
        unit: 'g',
        provenance: 'estimated_ai',
        confidence: 0.83,
        dailyValuePercentage: 18,
        sourceNote: "Estimated from arugula, spinach, cherry tomatoes, and basil"
      },
      sodium: {
        value: 620,
        unit: 'mg',
        provenance: 'estimated_ai',
        confidence: 0.75,
        dailyValuePercentage: 27,
        sourceNote: "Estimated based on typical restaurant pasta water and salted sauce"
      }
    },
    interpretation: {
      keyTakeaways: [
        {
          title: "Balanced Macronutrient Distribution",
          description: "Features a balanced 50% carb / 22% protein / 28% fat energy ratio with meaningful dietary fiber from fresh leafy greens.",
          sentiment: "positive",
          metricTag: "22g Protein / 5g Fiber"
        },
        {
          title: "Computer Vision Volume Estimation",
          description: "Portion size is estimated from 2D plate perspective at ~350g total weight. Exact values vary depending on oil and sauce volume.",
          sentiment: "neutral",
          metricTag: "~350g Estimated Plate"
        },
        {
          title: "Fresh Unprocessed Preparation",
          description: "Prepared from recognizable whole and minimally processed culinary ingredients rather than ultra-processed formulations.",
          sentiment: "positive",
          metricTag: "Fresh Culinary Meal"
        }
      ],
      processingLevel: {
        novaGroup: 2,
        label: "Culinary Preparation (Nova 2/3)",
        explanation: "Hand-cooked meal combining minimally processed foods (pasta, vegetables, beef) with culinary ingredients (olive oil, salt, spices).",
        markers: ["Semolina Pasta", "Fresh Leaf Greens", "Tomato Ragù", "Olive Oil", "Aged Cheese"]
      },
      dietarySuitability: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        ketoFriendly: false
      }
    },
    ingredientsAnalysis: {
      rawExtractedText: "VISUALLY IDENTIFIED COMPONENTS: Cooked semolina spaghetti, slow-simmered tomato ragù with minced beef, fresh basil leaves, shaved parmesan cheese, side garden salad with baby spinach, arugula, cherry tomatoes, and olive oil vinaigrette.",
      extractedIngredients: [
        { name: "Semolina Spaghetti", purpose: "Carbohydrate base", isAdditive: false, riskLevel: 'safe', description: "Enriched durum wheat semolina pasta." },
        { name: "Crushed Tomatoes & Basil", purpose: "Sauce base", isAdditive: false, riskLevel: 'safe', description: "Rich source of lycopene antioxidant and vitamin C." },
        { name: "Minced Beef Ragù", purpose: "Protein source", isAdditive: false, riskLevel: 'safe', description: "Provides bioavailable iron, zinc, and complete protein." },
        { name: "Baby Greens & Cherry Tomatoes", purpose: "Fresh fiber & micronutrients", isAdditive: false, riskLevel: 'safe', description: "Fresh salad greens adding dietary fiber, folate, and potassium." },
        { name: "Extra Virgin Olive Oil", purpose: "Culinary fat", isAdditive: false, riskLevel: 'safe', description: "Rich in oleic acid (monounsaturated fat) and polyphenols." },
        { name: "Aged Shaved Cheese", purpose: "Flavor and calcium", isAdditive: false, riskLevel: 'safe', description: "Parmesan style hard cheese." }
      ],
      declaredAllergens: ["Wheat (Gluten)", "Milk / Dairy"],
      crossContaminationWarnings: [],
      allergenCautionMessage: "Always verify the original packaging. AI extraction may miss allergens.",
      unreadableSections: ["Undetected seasoning ratios and hidden sauce sugars cannot be verified from a single photo."]
    },
    foodSafety: {
      dateType: "not_detected",
      dateExtracted: null,
      isDateAmbiguous: true,
      storageInstructions: "Freshly cooked meal. If storing leftovers, refrigerate in an airtight container within 2 hours at below 4°C.",
      packagingIntegrityNotes: "Plated meal, no packaging present.",
      recallStatus: {
        checked: false,
        hasRecalls: false,
        details: "Not applicable to fresh home/restaurant plated meals."
      },
      safetyDisclaimer: "Photographs alone cannot determine microbiological safety or contamination."
    },
    evidenceItems: [
      {
        id: 'ev-p1',
        claim: "Carbohydrates & Calories derived from visual pasta volume",
        provenance: 'estimated_ai',
        extractedSnippet: "Spaghetti segmented area: ~180g cooked mass. Caloric range: 500-560 kcal.",
        locationOnPackage: "Plate center quadrant",
        externalSource: { name: "USDA Standard Reference Pasta, cooked", referenceId: "FDC ID 168936" }
      },
      {
        id: 'ev-p2',
        claim: "Allergen detection: Wheat (pasta) and Dairy (parmesan)",
        provenance: 'needs_verification',
        extractedSnippet: "Visual detection of durum semolina pasta strand structure and cheese shavings.",
        locationOnPackage: "Visual ingredient segmentation"
      }
    ],
    recommendations: [
      {
        id: 'rec-p1',
        title: "Adjust for Hidden Cooking Oils",
        action: "If cooked in a restaurant, sodium and added oils may be 20-30% higher than baseline home recipes.",
        rationale: "Commercial kitchens often use higher butter and salt concentrations for flavor enhancement.",
        iconType: "portion"
      },
      {
        id: 'rec-p2',
        title: "Great Veggie-to-Carb Synergy",
        action: "Eating the salad portion first helps blunt post-meal blood glucose spikes through fiber pre-loading.",
        rationale: "Dietary fiber delays gastric emptying and smooths carbohydrate absorption curves.",
        iconType: "check"
      }
    ],
    suggestedQuestions: [
      "How accurate are AI calorie estimates for cooked meals?",
      "Can Gemma 4 detect how much oil was used in the sauce?",
      "Is the protein content high enough for post-workout recovery?",
      "What portion size was assumed for this plate?"
    ]
  },
  {
    id: 'sample-buldak-ramen',
    name: "Samyang 2x Spicy Buldak Hot Chicken Ramen",
    brand: "Samyang Foods Co., Ltd.",
    category: "Instant Noodles & Soups",
    scanType: "packaged",
    timestamp: "2026-10-09T07:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    status: "analyzed",
    confidenceScore: 0.95,
    servingBasis: "per 1 package (140 g)",
    servingSizeGrams: 140,
    servingsPerContainer: 1,
    isDemoSample: true,
    nutrition: {
      calories: {
        value: 550,
        unit: 'kcal',
        provenance: 'extracted_label',
        confidence: 0.99,
        dailyValuePercentage: 28,
        sourceNote: "Extracted: Calories 550"
      },
      protein: {
        value: 13,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.96,
        dailyValuePercentage: 26,
        sourceNote: "Extracted: Protein 13g"
      },
      carbohydrates: {
        value: 85,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.98,
        dailyValuePercentage: 31,
        sourceNote: "Extracted: Total Carbohydrate 85g"
      },
      totalSugar: {
        value: 7,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.95,
        dailyValuePercentage: 14,
        sourceNote: "Extracted: Total Sugars 7g"
      },
      addedSugar: {
        value: 6,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.92,
        dailyValuePercentage: 12,
        sourceNote: "Extracted: Includes 6g Added Sugars"
      },
      totalFat: {
        value: 17,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.97,
        dailyValuePercentage: 22,
        sourceNote: "Extracted: Total Fat 17g"
      },
      saturatedFat: {
        value: 8,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.96,
        dailyValuePercentage: 40,
        sourceNote: "Extracted: Saturated Fat 8g (40% DV)"
      },
      dietaryFiber: {
        value: 4,
        unit: 'g',
        provenance: 'extracted_label',
        confidence: 0.90,
        dailyValuePercentage: 14,
        sourceNote: "Extracted: Dietary Fiber 4g"
      },
      sodium: {
        value: 1680,
        unit: 'mg',
        provenance: 'extracted_label',
        confidence: 0.99,
        dailyValuePercentage: 73,
        sourceNote: "Extracted: Sodium 1,680mg (73% DV)"
      }
    },
    interpretation: {
      keyTakeaways: [
        {
          title: "Extreme Sodium Density Alert",
          description: "1,680 mg of sodium constitutes 73% of the total recommended daily intake for an adult in a single meal.",
          sentiment: "warning",
          metricTag: "1,680mg Sodium (73% DV)"
        },
        {
          title: "Substantial Saturated Fat from Palm Oil",
          description: "Delivers 8g of saturated fat (40% DV) primarily from the deep-fried instant wheat noodle block.",
          sentiment: "warning",
          metricTag: "8g Sat Fat (40% DV)"
        },
        {
          title: "Notable Energy & Carbohydrate Load",
          description: "550 kcal and 85g carbohydrates per serving. Highly satiating short-term but rapidly digested starch.",
          sentiment: "neutral",
          metricTag: "550 kcal / 85g Carbs"
        }
      ],
      processingLevel: {
        novaGroup: 4,
        label: "Ultra-Processed Food (Nova 4)",
        explanation: "Contains deep-fried refined starches, flavor enhancers (MSG E621, ribonucleotides E635), artificial colors, and chili extract.",
        markers: ["Palm Oil Fried Noodles", "Monosodium Glutamate", "Disodium 5'-Ribonucleotide", "Paprika Oleoresin", "Guar Gum"]
      },
      dietarySuitability: {
        vegetarian: true,
        vegan: false,
        glutenFree: false,
        dairyFree: true,
        ketoFriendly: false
      }
    },
    ingredientsAnalysis: {
      rawExtractedText: "NOODLE (76.7%): WHEAT FLOUR, MODIFIED TAPIOCA STARCH, REFINED PALM OIL, WHEAT GLUTEN, SALT, SOYBEAN OIL, ACIDITY REGULATORS [POTASSIUM CARBONATE (E501), SODIUM CARBONATE (E500), SODIUM PHOSPHATE DIBASIC (E339), CITRIC ACID (E330)], THICKENER [GUAR GUM (E412)], GREEN TEA FLAVOR OIL. SOUP (22.7%): WATER, SOY SAUCE, WHITE SUGAR, ARTIFICIAL CHICKEN FLAVOR POWDER, CHILI PEPPER POWDER, SOYBEAN OIL, ONION, RED PEPPER SEED OIL, YEAST EXTRACT POWDER, GARLIC, MODIFIED POTATO STARCH, DECOLORIZED CHILI EXTRACT, PAPRIKA EXTRACT, BLACK PEPPER POWDER, CURRY POWDER. FLAKE (0.6%): ROASTED SESAME, ROASTED LAVER. CONTAINS WHEAT, GLUTEN, SOY, SESAME.",
      extractedIngredients: [
        { name: "Wheat Flour & Modified Tapioca", purpose: "Noodle structure", isAdditive: false, riskLevel: 'safe', description: "Refined flour and modified starch providing chewy texture." },
        { name: "Refined Palm Oil", purpose: "Frying oil", isAdditive: false, riskLevel: 'caution', description: "High in saturated palmitic acid." },
        { name: "Monosodium Glutamate (MSG, E621)", purpose: "Flavor enhancer", isAdditive: true, riskLevel: 'safe', description: "Glutamic acid sodium salt triggering intense umami perception.", sourceECode: "E621" },
        { name: "Disodium Ribonucleotides (E635)", purpose: "Synergistic flavor enhancer", isAdditive: true, riskLevel: 'safe', description: "Amplifies umami sensation up to 8x when paired with MSG.", sourceECode: "E635" },
        { name: "Paprika Extract (E160c)", purpose: "Natural red coloring", isAdditive: true, riskLevel: 'safe', description: "Carotenoid pigment extracted from mild capsicum.", sourceECode: "E160c" },
        { name: "Guar Gum (E412)", purpose: "Texture stabilizer", isAdditive: true, riskLevel: 'safe', description: "Plant seed galactomannan improving noodle tensile strength.", sourceECode: "E412" }
      ],
      declaredAllergens: ["Wheat", "Gluten", "Soy", "Sesame"],
      crossContaminationWarnings: ["Celery", "Crustaceans", "Eggs", "Fish", "Milk", "Molluscs", "Mustard", "Nuts", "Peanuts"],
      allergenCautionMessage: "Always verify the original packaging. AI extraction may miss allergens.",
      unreadableSections: []
    },
    foodSafety: {
      dateType: "best_before",
      dateExtracted: "12 AUG 2026",
      dateRawSnippet: "BBD: 12.08.2026 M14B",
      isDateAmbiguous: false,
      storageInstructions: "Store in a cool dry place. Avoid direct sunlight and high humidity.",
      packagingIntegrityNotes: "Sealed composite plastic bag.",
      recallStatus: {
        checked: true,
        hasRecalls: false,
        source: "Korean MFDS & Global Recall Watch",
        details: "No current alerts registered for this product."
      },
      safetyDisclaimer: "Photographs alone cannot determine microbiological safety or contamination."
    },
    evidenceItems: [
      {
        id: 'ev-b1',
        claim: "Sodium: 1,680mg per packet (73% DV)",
        provenance: 'extracted_label',
        extractedSnippet: "Sodium 1,680mg 73% Daily Value",
        locationOnPackage: "Back panel, Nutrition Facts line 7",
        externalSource: { name: "Open Food Facts", referenceId: "8801073142275", url: "https://world.openfoodfacts.org/product/8801073142275" }
      },
      {
        id: 'ev-b2',
        claim: "Total Calories: 550 kcal per packet",
        provenance: 'extracted_label',
        extractedSnippet: "Calories 550 per serving 1 container",
        locationOnPackage: "Back panel, prominent box top right"
      }
    ],
    recommendations: [
      {
        id: 'rec-b1',
        title: "Use Half the Sauce Packet to Reduce Sodium",
        action: "Using 50% of the sauce paste cuts sodium by roughly 800mg without losing significant chili heat.",
        rationale: "Most sodium is concentrated in the sauce slurry rather than the dry noodles.",
        iconType: "portion"
      },
      {
        id: 'rec-b2',
        title: "Add Fresh Greens and Egg",
        action: "Add bok choy, spinach, or an egg to introduce potassium, fiber, and complete protein to offset electrolyte balance.",
        rationale: "Potassium helps kidneys excrete surplus dietary sodium.",
        iconType: "alternative"
      }
    ],
    suggestedQuestions: [
      "Why is the sodium content so high in instant ramen?",
      "What are acidity regulators E501 and E500?",
      "Can this be safely consumed by someone with celiac disease?",
      "How can I make this meal more nutritionally balanced?"
    ]
  }
];
