import datetime
from ..schemas.nutrition import FoodScanResult, AskQuestionResponse


def answer_food_question_service(
    question: str,
    food: FoodScanResult
) -> AskQuestionResponse:
    q = question.lower().strip()
    now_str = datetime.datetime.now().strftime("%I:%M %p")

    # Medical & Diagnostic Safety Guardrail
    medical_keywords = [
        "cure", "disease", "diagnose", "prescription", "medicine",
        "treat cancer", "diabetes treatment", "hypertension cure"
    ]
    if any(k in q for k in medical_keywords):
        return AskQuestionResponse(
            id=f"ans-{int(datetime.datetime.now().timestamp())}",
            text=(
                "NutriScan AI is an educational food intelligence tool and does not provide "
                "medical diagnoses, clinical treatment plans, or pharmaceutical advice. "
                "For chronic health conditions or dietary treatment, please consult a physician or registered dietitian."
            ),
            timestamp=now_str,
            citations=["Clinical Disclaimer: Educational software only"],
            unsupported_query_warning=True
        )

    # Sugar Inquiry
    if "sugar" in q or "sweet" in q:
        sugar = food.nutrition.total_sugar.value
        added = food.nutrition.added_sugar.value if food.nutrition.added_sugar else None
        dv = food.nutrition.total_sugar.daily_value_percentage
        cit = [food.nutrition.total_sugar.source_note or "Extracted Nutrition Facts Panel"]
        text = f"According to the verified packaging label for **{food.name}**, one stated serving ({food.serving_basis}) contains {sugar or 'Not available'}g of total sugars"
        if added is not None:
            text += f" (including {added}g of added sugars"
            if dv is not None:
                text += f", representing {dv:.0f}% of daily recommended limit"
            text += ")"
        text += ". The American Heart Association recommends limiting added sugars to under 25g/day for women and 36g/day for men."
        return AskQuestionResponse(
            id=f"ans-{int(datetime.datetime.now().timestamp())}",
            text=text,
            timestamp=now_str,
            citations=cit
        )

    # Ingredients & Additives Explanation
    if "ingredient" in q or "additive" in q or "explain" in q or "lecithin" in q or "msg" in q or "maltodextrin" in q:
        additives = [i for i in food.ingredients_analysis.extracted_ingredients if i.is_additive]
        if additives:
            items_text = "\n\n".join([f"• **{a.name}** ({a.purpose or 'Additive'}): {a.description or 'Processed formulation component.'}" for a in additives])
            text = f"Here is the plain-language breakdown of key additives extracted from {food.name}:\n\n{items_text}"
        else:
            names = [i.name for i in food.ingredients_analysis.extracted_ingredients]
            text = f"The extracted ingredients for {food.name} are: {', '.join(names)}. No industrial emulsifiers, artificial colorings, or synthetic leaveners were flagged."
        return AskQuestionResponse(
            id=f"ans-{int(datetime.datetime.now().timestamp())}",
            text=text,
            timestamp=now_str,
            citations=["Ingredients Paragraph OCR Inspection", "Open Food Facts Additives Registry"]
        )

    # Allergens
    if "allergen" in q or "allergy" in q or "peanut" in q or "gluten" in q or "celiac" in q or "dairy" in q:
        declared = ", ".join(food.ingredients_analysis.declared_allergens) or "None explicitly declared"
        warnings = ", ".join(food.ingredients_analysis.cross_contamination_warnings) or "No shared facility advisory noted"
        text = (
            f"**Declared Allergens:** {declared}\n\n"
            f"**Advisory Cross-Contact Warnings:** {warnings}\n\n"
            f"⚠️ **Mandatory Warning:** {food.ingredients_analysis.allergen_caution_message}"
        )
        return AskQuestionResponse(
            id=f"ans-{int(datetime.datetime.now().timestamp())}",
            text=text,
            timestamp=now_str,
            citations=["Packaging OCR 'Contains' Declaration", "Shared Facility Advisory Stamp"]
        )

    # Missing Information
    if "missing" in q or "unreadable" in q or "verify" in q:
        unreadable = ", ".join(food.ingredients_analysis.unreadable_sections or []) or "No illegible sections detected"
        date_info = food.food_safety.date_extracted or "Expiry/Best-before date could not be detected from image"
        text = (
            f"Based on the visual bounding inspection of this scan:\n\n"
            f"• **Expiry Date:** {date_info}\n"
            f"• **Unreadable Sections:** {unreadable}\n"
            f"• **Servings Count:** {f'{food.servings_per_container} servings' if food.servings_per_container else 'Not clearly printed on this angle'}\n\n"
            "Capturing both front and rear packaging panels ensures complete label coverage."
        )
        return AskQuestionResponse(
            id=f"ans-{int(datetime.datetime.now().timestamp())}",
            text=text,
            timestamp=now_str,
            citations=["Visual Quality Bounding Audit", "Evidence Completeness Check"]
        )

    # General Evidence Grounding
    n = food.nutrition
    text = (
        f"Regarding **{food.name}** ({food.serving_basis}):\n\n"
        f"• Calories: {n.calories.value or 'N/A'} kcal ({n.calories.provenance})\n"
        f"• Protein: {n.protein.value or 'N/A'}g\n"
        f"• Total Carbohydrates: {n.carbohydrates.value or 'N/A'}g (Sugars: {n.total_sugar.value or 'N/A'}g)\n"
        f"• Sodium: {n.sodium.value or 'N/A'}mg\n\n"
        "Feel free to ask about specific ingredients, allergen cross-contacts, or 100g normalization."
    )
    return AskQuestionResponse(
        id=f"ans-{int(datetime.datetime.now().timestamp())}",
        text=text,
        timestamp=now_str,
        citations=["NutriScan AI Verified Evidence Record"]
    )
