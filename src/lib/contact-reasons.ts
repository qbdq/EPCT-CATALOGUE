export const contactReasons = [
  { value: 'devis', label: 'Demander un devis' },
  { value: 'explications', label: 'Demander des explications' },
  { value: 'disponibilite', label: "Verifier la disponibilite d'une piece" },
  { value: 'rappel', label: 'Demander un rappel' },
  { value: 'sav', label: 'Support apres-vente' },
  { value: 'autre', label: 'Autre demande' },
] as const;

export type ContactReasonValue = (typeof contactReasons)[number]['value'];
