'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import type { DefaultCellComponentProps } from 'payload';

type MediaLike =
  | number
  | string
  | {
      id?: number | string | null;
      alt?: string | null;
      filename?: string | null;
      thumbnailURL?: string | null;
      url?: string | null;
      value?: number | string | null;
      relationTo?: string | null;
      sizes?: {
        thumbnail?: {
          url?: string | null;
        } | null;
      } | null;
    }
  | null
  | undefined;

function getMediaUrl(media: MediaLike) {
  if (!media || typeof media === 'string' || typeof media === 'number') return null;

  if (media.thumbnailURL) return media.thumbnailURL;
  if (media.sizes?.thumbnail?.url) return media.sizes.thumbnail.url;
  if (media.url) return media.url;
  if (media.filename) return `/api/media/file/${media.filename}`;

  return null;
}

function getMediaId(media: MediaLike) {
  if (!media) return null;
  if (typeof media === 'string' || typeof media === 'number') return String(media);
  if (media.value !== undefined && media.value !== null) return String(media.value);
  if (media.id !== undefined && media.id !== null) return String(media.id);
  return null;
}

async function fetchMediaFromId(id: string) {
  try {
    const directRes = await fetch(`/api/media/${id}?depth=1`, { credentials: 'same-origin' });
    if (directRes.ok) {
      return (await directRes.json()) as Exclude<MediaLike, string | null | undefined>;
    }

    const listRes = await fetch(
      `/api/media?where[id][equals]=${encodeURIComponent(id)}&limit=1&depth=1`,
      { credentials: 'same-origin' },
    );

    if (!listRes.ok) return null;

    const json = (await listRes.json()) as {
      docs?: Array<Exclude<MediaLike, string | null | undefined>>;
    };

    return json.docs?.[0] ?? null;
  } catch {
    return null;
  }
}

export default function UploadThumbnailCell({
  cellData,
  rowData,
  field,
}: DefaultCellComponentProps) {
  const fieldName = 'name' in field && typeof field.name === 'string' ? field.name : null;
  const initialMedia = (cellData ?? (fieldName ? rowData?.[fieldName] : null)) as MediaLike;
  const [resolvedMedia, setResolvedMedia] = useState<MediaLike>(initialMedia);

  useEffect(() => {
    let cancelled = false;

    async function hydrateMedia() {
      const directUrl = getMediaUrl(initialMedia);
      const mediaId = getMediaId(initialMedia);

      if (directUrl || !mediaId) {
        setResolvedMedia(initialMedia);
        return;
      }

      const nextMedia = await fetchMediaFromId(mediaId);
      if (!cancelled) {
        setResolvedMedia(nextMedia ?? initialMedia);
      }
    }

    void hydrateMedia();

    return () => {
      cancelled = true;
    };
  }, [initialMedia]);

  const imageUrl = getMediaUrl(resolvedMedia);

  if (!imageUrl) {
    return <span className="text-xs text-neutral-500">Aucune image</span>;
  }

  const alt =
    typeof resolvedMedia === 'object' &&
    resolvedMedia &&
    'alt' in resolvedMedia &&
    typeof resolvedMedia.alt === 'string'
      ? resolvedMedia.alt
      : 'Apercu';

  return (
    <div className="flex items-center">
      <img
        src={imageUrl}
        alt={alt}
        className="h-16 w-16 rounded-sm border border-neutral-200 object-cover"
      />
    </div>
  );
}
