'use client';

import Image, { type ImageProps } from 'next/image';

type ProtectedImageProps = ImageProps;

export function ProtectedImage(props: ProtectedImageProps) {
  return (
    <div
      className="relative h-full w-full select-none"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <Image
        {...props}
        draggable={false}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
      />
    </div>
  );
}
