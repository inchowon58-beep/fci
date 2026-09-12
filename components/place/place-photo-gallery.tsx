export type GalleryImage = {
  title: string;
  link: string;
  thumbnail: string;
};

/** 네이버 검색 썸네일(저해상도) — 한 줄 작은 사진으로만 표시 */
export function PlacePhotoGallery({
  images,
  businessName,
}: {
  images: GalleryImage[];
  businessName: string;
}) {
  if (images.length === 0) return null;

  const list = images.slice(0, 8);

  return (
    <section className="place-gallery" aria-label="관련 사진">
      <div className="place-gallery-row">
        {list.map((img, i) => {
          const src = img.thumbnail || img.link;
          return (
            <a
              key={`${src}-${i}`}
              className="place-gallery-chip"
              href={img.link}
              target="_blank"
              rel="noopener noreferrer"
              title={img.title || `${businessName} 관련 사진 ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${businessName} 관련 사진 ${i + 1}`}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </a>
          );
        })}
      </div>
      <p className="place-gallery-note">
        📷 사진 출처: 네이버 검색 · 저작권은 원 게시자에게 있습니다 ·{" "}
        <a href="/#owner">삭제 요청</a>
      </p>
    </section>
  );
}
