"use client";

import { useEffect, useState } from "react";
import { PlacePhotoGallery } from "@/components/place/place-photo-gallery";
import { PlaceBlogReviews } from "@/components/place/place-blog-reviews";
import type { NaverPlaceMedia } from "@/lib/naver-search";

type Store = { status: "loading" | "ready" | "empty"; media: NaverPlaceMedia | null };
const cache = new Map<string, Store>();
const listeners = new Map<string, Set<() => void>>();

function keyOf(name: string, city: string) {
  return `${name}@@${city}`;
}

function ensure(name: string, city: string) {
  const key = keyOf(name, city);
  if (cache.has(key)) return;
  cache.set(key, { status: "loading", media: null });
  const q = new URLSearchParams({ name, city });
  fetch(`/api/place/media?${q}`)
    .then((r) => r.json())
    .then((json) => {
      const media = json?.ok ? (json.media as NaverPlaceMedia) : null;
      const has = Boolean(media && (media.images?.length || media.blogs?.length));
      cache.set(key, { status: has ? "ready" : "empty", media });
      listeners.get(key)?.forEach((fn) => fn());
    })
    .catch(() => {
      cache.set(key, { status: "empty", media: null });
      listeners.get(key)?.forEach((fn) => fn());
    });
}

function useNaver(name: string, city: string): Store {
  const key = keyOf(name, city);
  const [state, setState] = useState<Store>(() => cache.get(key) || { status: "loading", media: null });

  useEffect(() => {
    ensure(name, city);
    const sync = () => setState(cache.get(key) || { status: "loading", media: null });
    sync();
    const set = listeners.get(key) || new Set<() => void>();
    set.add(sync);
    listeners.set(key, set);
    return () => {
      set.delete(sync);
    };
  }, [name, city, key]);

  return state;
}

/** SSR에서 네이버를 빼 함수 시간↓ — 갤러리·블로그가 같은 fetch를 공유 */
export function PlaceNaverGalleryLazy({ name, city }: { name: string; city: string }) {
  const { media } = useNaver(name, city);
  if (!media?.images?.length) return null;
  return <PlacePhotoGallery images={media.images} businessName={name} />;
}

export function PlaceNaverBlogsLazy({ name, city }: { name: string; city: string }) {
  const { status, media } = useNaver(name, city);
  if (status === "loading") return <span id="bxa_blog" className="place-anc" />;
  if (!media?.blogs?.length) return <span id="bxa_blog" className="place-anc" />;
  return <PlaceBlogReviews blogs={media.blogs} total={media.totalBlog} businessName={name} />;
}
