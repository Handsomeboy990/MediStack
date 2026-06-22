// Translates API error codes into messages the user can understand.
// The frontend never displays a raw technical message to the user.
const messages: Record<string, string> = {
  VALIDATION_ERROR: 'Certaines informations saisies sont invalides.',
  UNAUTHENTICATED: 'Veuillez vous connecter pour continuer.',
  FORBIDDEN: "Vous n'avez pas l'autorisation d'effectuer cette action.",
  NOT_FOUND: "L'élément demandé est introuvable.",
  CONFLICT: 'Cette opération entre en conflit avec une donnée existante.',
  INTERNAL_ERROR: 'Une erreur technique est survenue. Réessayez plus tard.',
};

export function messageForCode(code: string): string {
  return messages[code] ?? 'Une erreur inattendue est survenue.';
}
