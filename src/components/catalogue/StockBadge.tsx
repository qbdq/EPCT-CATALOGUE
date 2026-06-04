type StockBadgeProps = {
  status?: string;
};

const stockMeta: Record<string, { label: string; className: string }> = {
  'in-stock': {
    label: 'Disponible',
    className: 'bg-emerald-600 text-white',
  },
  'out-of-stock': {
    label: 'Rupture de stock',
    className: 'bg-red-600 text-white',
  },
  'on-order': {
    label: 'Sur commande',
    className: 'bg-orange-500 text-white',
  },
};

export function StockBadge({ status }: StockBadgeProps) {
  if (!status || !stockMeta[status]) return null;

  const meta = stockMeta[status];

  return (
    <span
      className={`inline-flex min-h-9 items-center px-4 text-[11px] font-bold uppercase tracking-[0.08em] ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
