"use client";

export function PlaceShare() {
  return (
    <button
      type="button"
      className="place-qbtn"
      onClick={async () => {
        const url = location.href;
        if (navigator.share) {
          try {
            await navigator.share({ title: document.title, url });
            return;
          } catch {
            /* cancelled */
          }
        }
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          const label = document.getElementById("place-share-label");
          if (label) label.textContent = "복사됨";
        }
      }}
    >
      <span className="place-qi">📤</span>
      <span id="place-share-label" className="place-qp">
        공유
      </span>
    </button>
  );
}
