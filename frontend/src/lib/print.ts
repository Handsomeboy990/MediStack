import { CLINIQUE, LOGICIEL, STATUT_LABELS, fmt } from './mock-data';

const genereLe = () => `Document généré le ${new Date().toLocaleString('fr-FR')} par ${LOGICIEL}.`;

// Données minimales nécessaires pour imprimer une facture ou un ticket. Couvre
// aussi bien une facture enregistrée qu'une facture en cours de saisie.
export type PrintableFacture = {
  id: string;
  patient: string;
  date: string;
  agent: string;
  lignes: { libelle: string; qte: number; pu: number }[];
  montantBrut: number;
  assurancePrise: number;
  net: number;
  verse: number;
  statut?: keyof typeof STATUT_LABELS;
  modePaiement?: string | null;
};

const VERT = '#004D40';

const BASE_CSS = `
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; margin: 0; padding: 24px; }
  @media print { body { padding: 0; } }
`;

function openDocument(title: string, css: string, body: string) {
  const win = window.open('', '_blank', 'width=860,height=720');
  if (!win) {
    // Les pop-ups sont bloquées : on prévient l'utilisateur plutôt que d'échouer en silence.
    alert("Autorisez les fenêtres pop-up pour imprimer.");
    return;
  }
  win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title><style>${BASE_CSS}${css}</style></head><body>${body}</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

function lignesRows(f: PrintableFacture) {
  return f.lignes
    .map(
      (l) => `<tr>
        <td>${l.libelle}</td>
        <td class="r">${l.qte}</td>
        <td class="r">${fmt(l.pu)}</td>
        <td class="r b">${fmt(l.qte * l.pu)}</td>
      </tr>`,
    )
    .join('');
}

export function printFacture(f: PrintableFacture) {
  const reste = f.net - f.verse;
  const statut = f.statut ? STATUT_LABELS[f.statut] : 'En attente';
  const css = `
    .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid ${VERT}; padding-bottom: 16px; }
    .head h1 { color: ${VERT}; margin: 0; font-size: 24px; }
    .head p { margin: 2px 0; font-size: 12px; color: #555; }
    .meta { text-align: right; }
    .meta h2 { margin: 0; letter-spacing: 2px; color: ${VERT}; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 20px 0; font-size: 13px; }
    .parties span { color: #777; display: block; font-size: 11px; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
    th { background: ${VERT}; color: #fff; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; }
    td { padding: 8px 10px; border-bottom: 1px solid #eee; }
    .r { text-align: right; } .b { font-weight: bold; }
    .totaux { margin-top: 16px; margin-left: auto; width: 280px; font-size: 13px; }
    .totaux div { display: flex; justify-content: space-between; padding: 4px 0; }
    .totaux .net { border-top: 2px solid ${VERT}; margin-top: 4px; padding-top: 8px; font-size: 16px; font-weight: bold; color: ${VERT}; }
    footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 11px; color: #888; text-align: center; }
  `;
  const body = `
    <div class="head">
      <div><h1>${CLINIQUE.nom}</h1><p>${CLINIQUE.adresse}</p><p>Tél : ${CLINIQUE.telephone} · ${CLINIQUE.email}</p><p>${CLINIQUE.ifu}</p></div>
      <div class="meta"><h2>FACTURE</h2><p>${f.id}</p><p>${f.date}</p></div>
    </div>
    <div class="parties">
      <div><span>Patient</span><strong>${f.patient}</strong></div>
      <div><span>Agent</span><strong>${f.agent}</strong></div>
      <div><span>Statut</span><strong>${statut}</strong></div>
      <div><span>Mode de paiement</span><strong>${f.modePaiement ?? '-'}</strong></div>
    </div>
    <table>
      <thead><tr><th>Désignation</th><th class="r">Qté</th><th class="r">PU</th><th class="r">Montant</th></tr></thead>
      <tbody>${lignesRows(f)}</tbody>
    </table>
    <div class="totaux">
      <div><span>Total brut</span><span>${fmt(f.montantBrut)}</span></div>
      <div><span>Prise en charge assurance</span><span>-${fmt(f.assurancePrise)}</span></div>
      <div class="net"><span>Net à payer</span><span>${fmt(f.net)}</span></div>
      <div><span>Versé</span><span>${fmt(f.verse)}</span></div>
      ${reste > 0 ? `<div><span>Reste à payer</span><span>${fmt(reste)}</span></div>` : ''}
    </div>
    <footer>Merci de votre confiance.<br>${genereLe()}</footer>
  `;
  openDocument(`Facture ${f.id}`, css, body);
}

export function printTicket(f: PrintableFacture, rendu = 0, monnaieRendue = true) {
  const reste = f.net - f.verse;
  const items = f.lignes
    .map((l) => `<div class="it"><span>${l.libelle} x${l.qte}</span><span>${fmt(l.qte * l.pu)}</span></div>`)
    .join('');
  const css = `
    body { width: 80mm; margin: 0 auto; font-size: 12px; }
    .t { text-align: center; }
    .t h1 { color: ${VERT}; margin: 0; font-size: 18px; }
    hr { border: none; border-top: 1px dashed #999; margin: 8px 0; }
    .it, .tot { display: flex; justify-content: space-between; padding: 2px 0; }
    .tot.net { font-weight: bold; font-size: 14px; color: ${VERT}; }
    .small { font-size: 11px; color: #555; }
  `;
  const body = `
    <div class="t"><h1>${CLINIQUE.nom}</h1><p class="small">${CLINIQUE.adresse} · ${CLINIQUE.telephone}</p><p class="small">Reçu de caisse</p></div>
    <hr>
    <p class="small">${f.id} · ${f.date}</p>
    <p class="small">Patient : ${f.patient}</p>
    <p class="small">Caissier : ${f.agent}</p>
    <hr>
    ${items}
    <hr>
    <div class="tot"><span>Brut</span><span>${fmt(f.montantBrut)}</span></div>
    <div class="tot"><span>Assurance</span><span>-${fmt(f.assurancePrise)}</span></div>
    <div class="tot net"><span>Net</span><span>${fmt(f.net)}</span></div>
    <div class="tot"><span>Versé</span><span>${fmt(f.verse)}</span></div>
    ${reste > 0 ? `<div class="tot"><span>Reste</span><span>${fmt(reste)}</span></div>` : ''}
    ${rendu > 0 ? `<div class="tot"><span>Rendu</span><span>${fmt(rendu)}</span></div>` : ''}
    ${rendu > 0 ? `<div class="tot"><span>Monnaie remise</span><span>${monnaieRendue ? 'Oui' : 'Non'}</span></div>` : ''}
    <div class="tot"><span>Mode</span><span>${f.modePaiement ?? '-'}</span></div>
    <hr>
    <div class="t small">Merci de votre visite</div>
    <div class="t small" style="margin-top:6px;color:#888">${genereLe()}</div>
  `;
  openDocument(`Ticket ${f.id}`, css, body);
}

export type CommandeLigne = { code: string; libelle: string; unite: string; qte: number; pu: number };

export function printBonCommande(lignes: CommandeLigne[]) {
  const total = lignes.reduce((s, l) => s + l.qte * l.pu, 0);
  const rows = lignes
    .map(
      (l) => `<tr>
        <td>${l.code}</td>
        <td>${l.libelle}</td>
        <td class="r">${l.qte} ${l.unite}</td>
        <td class="r">${fmt(l.pu)}</td>
        <td class="r b">${fmt(l.qte * l.pu)}</td>
      </tr>`,
    )
    .join('');
  const css = `
    .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid ${VERT}; padding-bottom: 16px; }
    .head h1 { color: ${VERT}; margin: 0; font-size: 24px; }
    .head p { margin: 2px 0; font-size: 12px; color: #555; }
    .meta { text-align: right; }
    .meta h2 { margin: 0; letter-spacing: 2px; color: ${VERT}; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th { background: ${VERT}; color: #fff; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; }
    td { padding: 8px 10px; border-bottom: 1px solid #eee; }
    .r { text-align: right; } .b { font-weight: bold; }
    tfoot td { border-top: 2px solid ${VERT}; font-weight: bold; color: ${VERT}; }
    footer { margin-top: 48px; display: flex; justify-content: space-between; font-size: 12px; color: #555; }
  `;
  const body = `
    <div class="head">
      <div><h1>${CLINIQUE.nom}</h1><p>Magasin central · ${CLINIQUE.adresse}</p><p>Tél : ${CLINIQUE.telephone}</p></div>
      <div class="meta"><h2>BON DE COMMANDE</h2><p>${new Date().toLocaleDateString('fr-FR')}</p></div>
    </div>
    <table>
      <thead><tr><th>Code</th><th>Désignation</th><th class="r">Quantité</th><th class="r">PU</th><th class="r">Total</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="4" class="r">Total estimé</td><td class="r">${fmt(total)}</td></tr></tfoot>
    </table>
    <footer><div>Établi par : ____________________</div><div>Visa responsable : ____________________</div></footer>
    <p style="margin-top:24px;font-size:11px;color:#888;text-align:center">${genereLe()}</p>
  `;
  openDocument('Bon de commande', css, body);
}
