import type { PetBusiness } from "./public-data";
import { categoryOfBusiness, sigunguOf } from "./directory";

/** 전체 목록을 한 번만 순회해 근처·유사·기타를 뽑음 */
export function pickRelatedBusinesses(
  all: PetBusiness[],
  business: PetBusiness,
  limits = { nearby: 4, similar: 6, others: 3 },
) {
  const category = categoryOfBusiness(business);
  const city = sigunguOf(business);
  const match = category ? new Set(category.match) : null;

  const nearby: PetBusiness[] = [];
  const similar: PetBusiness[] = [];
  const others: PetBusiness[] = [];

  for (const b of all) {
    if (b.id === business.id) continue;

    const sameArea = b.region === business.region || sigunguOf(b) === city;
    if (sameArea && nearby.length < limits.nearby) {
      nearby.push(b);
      continue;
    }

    if (match?.has(b.category) && similar.length < limits.similar) {
      similar.push(b);
      continue;
    }

    if (
      others.length < limits.others &&
      !nearby.some((n) => n.id === b.id) &&
      !similar.some((n) => n.id === b.id)
    ) {
      others.push(b);
    }

    if (
      nearby.length >= limits.nearby &&
      similar.length >= limits.similar &&
      others.length >= limits.others
    ) {
      break;
    }
  }

  return { nearby, similar, others, city, category };
}
