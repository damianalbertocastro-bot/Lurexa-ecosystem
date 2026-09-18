"use client";

import React from "react";
import { LUREXA_PRICING_PLANS } from "@lurexa/types";
import { useTranslation } from "@lurexa/i18n";
import styles from "../page.module.css";

interface PricingCardsProps {
  learnUrl?: string;
  teachUrl?: string;
}

export function PricingCards({ learnUrl, teachUrl }: PricingCardsProps) {
  const { t } = useTranslation();

  const planOrder: Array<"basic" | "plus" | "ultra"> = ["basic", "plus", "ultra"];

  // Map plan ids to i18n key prefixes
  const i18nPrefixMap: Record<string, string> = {
    basic: "starter",
    plus: "pro",
    ultra: "dual",
  };

  const resolveCtaHref = (planId: string) => {
    const plan = LUREXA_PRICING_PLANS[planId as keyof typeof LUREXA_PRICING_PLANS];
    if (planId === "basic") {
      return learnUrl ? `${learnUrl}/signup?plan=basic` : plan.ctaHref;
    }
    if (planId === "plus") {
      return learnUrl ? `${learnUrl}/signup?plan=plus` : plan.ctaHref;
    }
    if (planId === "ultra") {
      return teachUrl ? `${teachUrl}/signup?plan=ultra` : (learnUrl ? `${learnUrl}/signup?plan=ultra` : plan.ctaHref);
    }
    return plan.ctaHref;
  };

  return (
    <div className={styles.pricingGrid}>
      {planOrder.map((key) => {
        const plan = LUREXA_PRICING_PLANS[key];
        const isHighlighted = plan.highlighted;
        const prefix = i18nPrefixMap[key];

        // Resolve translated display strings from i18n
        const badge = t(`landing.pricing.${prefix}Badge`);
        const name = t(`landing.pricing.${prefix}Title`);
        const description = t(`landing.pricing.${prefix}Desc`);
        const price = t(`landing.pricing.${prefix}Price`);
        const period = t(`landing.pricing.${prefix}Period`);
        const ctaText = t(`landing.pricing.${prefix}Cta`);
        const includedLabel = t("landing.pricing.includedFeatures");

        // Collect feature keys (F1–F5)
        const featureKeys = ["F1", "F2", "F3", "F4", "F5"];
        const features = featureKeys
          .map((fk) => t(`landing.pricing.${prefix}${fk}`, ""))
          .filter((f) => f !== "");

        return (
          <article
            key={plan.id}
            className={`${styles.pricingCard} ${isHighlighted ? styles.pricingCardFeatured : ""}`}
          >
            {/* Badge */}
            <div>
              <span className={isHighlighted ? styles.planBadgeHighlight : styles.planBadge}>
                {badge}
              </span>

              {/* Title */}
              <h3>{name}</h3>

              {/* Price */}
              <p className={styles.planPrice}>
                {price === "$0" ? (plan.priceMonthly === 0 ? price : `$${plan.priceMonthly}`) : price}
                <span>{plan.priceMonthly === 0 ? "" : period}</span>
              </p>

              {/* Description */}
              <p className={styles.planDescription}>{description}</p>

              {/* Features */}
              <ul className={styles.planFeatures}>
                <li style={{ listStyle: "none", padding: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.6875rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: isHighlighted ? "var(--color-brand-primary)" : "#94a3b8",
                      marginBottom: "8px",
                    }}
                  >
                    {includedLabel}
                  </span>
                </li>
                {features.map((feature) => (
                  <li key={feature}>
                    <span style={{ color: "var(--color-brand-primary)", fontWeight: 700 }}>✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <a
              href={resolveCtaHref(plan.id)}
              className={isHighlighted ? styles.planButtonPrimary : styles.planButtonSecondary}
            >
              {ctaText} →
            </a>
          </article>
        );
      })}
    </div>
  );
}

export default PricingCards;
