import type { EducatorGrowthPathV1, EducatorQualificationScopeV1 } from "@lurexa/types";
import { getServerFirebaseAuth, getServerFirestore } from "./firebase-admin.server";
import { getEducatorBenefitEntitlements } from "./educator-access.server";
import { buildEducatorGrowthPath } from "./mind/educator-growth-path.server";

async function authenticateSelf(authorization: string | null): Promise<string> {
  if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication is required.");
  const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
  return token.uid;
}

export async function getTeachEducatorGrowthPath(authorization: string | null): Promise<EducatorGrowthPathV1> {
  try {
    const userId = await authenticateSelf(authorization);
    const [qualificationSnapshot, benefits] = await Promise.all([
      getServerFirestore().collection("educator-qualifications").doc(userId).collection("scopes").get(),
      getEducatorBenefitEntitlements(userId),
    ]);
    const qualifications = qualificationSnapshot.docs.map((doc) => doc.data() as EducatorQualificationScopeV1);
    return buildEducatorGrowthPath({ userId, qualifications, benefits });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      return buildEducatorGrowthPath({
        userId: "dev-educator-sandbox",
        qualifications: [],
        benefits: {
          contractVersion: "1",
          userId: "dev-educator-sandbox",
          teach: true,
          coachFull: true,
          source: "educator_benefit",
        },
      });
    }
    throw error;
  }
}
