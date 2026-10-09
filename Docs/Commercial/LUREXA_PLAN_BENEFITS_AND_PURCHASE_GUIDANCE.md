# Lurexa Plan Benefits & Purchase Guidance

Status: Authoritative commercial communication guidance for individual plan selection  
Date: 2026-09-18

## Purpose

A customer should be able to understand what they are buying before completing checkout.

The commercial experience must therefore explain:
1. what the plan is for;
2. who it is for;
3. the principal benefits it provides;
4. what the customer does not receive;
5. how it relates to the other Lurexa products;
6. whether the purchase is an individual subscription or an organizational contract.

This document describes customer-facing meaning. It does not replace Core entitlement enforcement.

## Individual choices

### Basic — Free

**Purpose:** Let a new learner discover their level and experience Lurexa before purchasing a full product.

**Principal benefits:** CEFR placement diagnostic; 3 level-matched trial modules; limited AI tutor usage; limited Coach voice practice; standard cloud processing.

**What it is not:** Basic is a trial/entry experience, not full access to Learn, Coach, or Teach.

### Plus — $9.99/month

Plus is a **single-product purchase**. The customer must explicitly choose one product: Learn Plus, Coach Plus, or Teach Plus.

The checkout flow must never present Plus as though all three products are included.

#### Learn Plus

**What the customer is buying:** Full access to the Lurexa Learn experience at the Plus entitlement level.

**Primary value:** Systematic English development through Lurexa's curriculum and learning experience.

**Principal benefits:** Full Learn product access; expanded Learn practice and assessment capabilities; Plus-level offline learning capability where supported; continued learner progress within the Lurexa ecosystem.

**Not included:** Full Coach or Full Teach entitlement; premium ElevenLabs speech entitlement.

#### Coach Plus

**What the customer is buying:** Full access to the Lurexa Coach experience at the Plus entitlement level.

**Primary value:** Focused spoken-English development.

**Principal benefits:** Full Coach product access; expanded voice-practice allowance; speaking and pronunciation practice; practice focused on intelligibility, fluency, naturalness, and pronunciation refinement.

**Not included:** Full Learn or Full Teach entitlement; premium ElevenLabs speech entitlement.

#### Teach Plus

**What the customer is buying:** Full access to the Lurexa Teach professional-learning experience at the Plus entitlement level.

**Primary value:** Professional growth for educators and future educators.

**Principal benefits:** Full Teach product access; professional-development learning; development of academic knowledge, methodology, planning, assessment, and practice; Teach-specific AI support within assigned capabilities and limits.

**Not included:** Full Learn or Full Coach entitlement.

A Teach subscription does not itself create educator qualification or teaching authorization.

## Ultra — $19.99/month

**Current reconciled direction:** Ultra provides full Learn + Coach access and deeper cross-product adaptation.

**Primary value:** An integrated learner experience rather than a single-product subscription.

**Principal benefits:** Full Learn access; full Coach access; higher voice and AI usage allowances than Basic/Plus; streaming audio capability where enabled; cross-product Learner Model synchronization; expanded offline learning; premium ElevenLabs speech capability when enabled by Core.

**Important boundary:** Older repository material describes Ultra as including the entire ecosystem, including Teach and Studio. That wording conflicts with the newer commercial reconciliation and must not be used in customer-facing purchase flows until an explicit entitlement decision is made.

## Institutional and business access

Campus, institutional, and business access are organizational contracts rather than consumer versions of Basic/Plus/Ultra.

The customer-facing experience should explain the contracted capabilities relevant to the organization, which may include seats and membership management, product bundles, shared quota pools, administration and governance, Insight analytics, SSO/integrations, export, branding, Studio, Learn, Coach, Teach, or other entitled products.

Exact bundles, prices, and Business SKU names must not be invented where the commercial contract has not been approved.

## Account continuity

A Plus purchase is attached to the customer's existing Lurexa identity.

Choosing Learn Plus, Coach Plus, or Teach Plus does not create a separate account. A customer can later acquire additional product entitlements without creating another Lurexa identity.

Shared identity and authorized learner-model continuity are ecosystem capabilities; they should not be presented as though buying one Plus product automatically unlocks the other products.

## Purchase-page requirements

Every individual purchase flow should answer these questions before checkout:

**What am I buying?** The exact product and plan must be named.

**Why would I buy it?** Show the product's primary purpose and principal benefits.

**What do I get?** Show the concrete capabilities and applicable quotas.

**What do I not get?** Show the important excluded product entitlements or premium capabilities.

**What happens to my account?** Explain that the purchase uses the same Lurexa identity.

**Can I add another product later?** Explain that additional product entitlements can be acquired without creating another account.

## Architectural rule

Customer-facing benefit descriptions may explain an entitlement, but they must never be the authority that grants it.

The authoritative chain remains:

Identity → commercial source → Core entitlements → capability/product access → quota enforcement → product experience.

## Reconciliation note

The legacy SubscriptionTier and PlanQuotas structures remain for compatibility while migration continues. They must not be used to infer that generic PLUS means Learn + Coach + Teach. The selected Plus product is explicit in the billing contract.
