'use client';

import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

type LexicalNode = {
  type?: string;
  tag?: string;
  format?: number;
  text?: string;
  url?: string;
  children?: LexicalNode[];
};

type BlogRichTextProps = {
  content: unknown;
};

function renderTextNode(node: LexicalNode, key: string) {
  let rendered: ReactNode = node.text ?? '';

  if (node.format && typeof rendered === 'string') {
    if (node.format & 1) rendered = <strong key={`${key}-bold`}>{rendered}</strong>;
    if (node.format & 2) rendered = <em key={`${key}-italic`}>{rendered}</em>;
    if (node.format & 8) rendered = <u key={`${key}-underline`}>{rendered}</u>;
  }

  return <span key={key}>{rendered}</span>;
}

function renderChildren(children: LexicalNode[] | undefined, prefix: string) {
  if (!children?.length) return null;

  return children.map((child, index) => renderNode(child, `${prefix}-${index}`));
}

function renderNode(node: LexicalNode, key: string): ReactNode {
  switch (node.type) {
    case 'text':
      return renderTextNode(node, key);
    case 'linebreak':
      return <br key={key} />;
    case 'paragraph':
      return (
        <p key={key} className="text-base leading-8 text-epct-ink/80">
          {renderChildren(node.children, key)}
        </p>
      );
    case 'heading': {
      const level = node.tag === 'h3' ? 'h3' : node.tag === 'h4' ? 'h4' : 'h2';
      if (level === 'h3') {
        return (
          <h3 key={key} className="font-display text-2xl uppercase text-epct-dark">
            {renderChildren(node.children, key)}
          </h3>
        );
      }
      if (level === 'h4') {
        return (
          <h4 key={key} className="font-display text-xl uppercase text-epct-dark">
            {renderChildren(node.children, key)}
          </h4>
        );
      }
      return (
        <h2 key={key} className="font-display text-3xl uppercase text-epct-dark">
          {renderChildren(node.children, key)}
        </h2>
      );
    }
    case 'list':
      return node.tag === 'ol' ? (
        <ol key={key} className="list-decimal space-y-2 pl-5 text-base leading-8 text-epct-ink/80">
          {renderChildren(node.children, key)}
        </ol>
      ) : (
        <ul key={key} className="list-disc space-y-2 pl-5 text-base leading-8 text-epct-ink/80">
          {renderChildren(node.children, key)}
        </ul>
      );
    case 'listitem':
      return <li key={key}>{renderChildren(node.children, key)}</li>;
    case 'quote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-epct-green bg-[#f8f8f6] px-5 py-4 text-base leading-8 text-epct-ink/80"
        >
          {renderChildren(node.children, key)}
        </blockquote>
      );
    case 'link':
      return (
        <Link
          key={key}
          href={node.url || '#'}
          className="font-semibold text-epct-green underline underline-offset-4"
        >
          {renderChildren(node.children, key)}
        </Link>
      );
    default:
      return <Fragment key={key}>{renderChildren(node.children, key)}</Fragment>;
  }
}

export function BlogRichText({ content }: BlogRichTextProps) {
  const root = content as { root?: { children?: LexicalNode[] } } | null;
  const nodes = root?.root?.children ?? [];

  if (!nodes.length) return null;

  return <div className="grid gap-5">{nodes.map((node, index) => renderNode(node, `node-${index}`))}</div>;
}
