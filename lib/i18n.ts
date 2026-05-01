export type Locale = "es" | "en" | "fr" | "it" | "pt";

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "es";
  const supported: Locale[] = ["es", "en", "fr", "it", "pt"];
  const param = new URLSearchParams(window.location.search).get("lang")?.toLowerCase();
  if (param && supported.includes(param as Locale)) return param as Locale;
  const nav = navigator.language.toLowerCase().split(/[-_]/)[0];
  return supported.includes(nav as Locale) ? (nav as Locale) : "es";
}

// ── Locale display names (for system prompt) ─────────────────────────────────

export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Spanish",
  en: "English",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
};

// ── UI translations ───────────────────────────────────────────────────────────

const ui = {
  // ── Common ──────────────────────────────────────────────────────────────────
  poweredBy: {
    es: "Powered by Acustega",
    en: "Powered by Acustega",
    fr: "Propulsé par Acustega",
    it: "Powered by Acustega",
    pt: "Desenvolvido por Acustega",
  },
  back: {
    es: "Volver",
    en: "Back",
    fr: "Retour",
    it: "Indietro",
    pt: "Voltar",
  },
  continueBtn: {
    es: "Continuar al asesor",
    en: "Continue to advisor",
    fr: "Continuer vers le conseiller",
    it: "Continua al consulente",
    pt: "Continuar ao assessor",
  },
  skipAll: {
    es: "Saltar todo",
    en: "Skip all",
    fr: "Tout passer",
    it: "Salta tutto",
    pt: "Pular tudo",
  },
  online: {
    es: "En línea",
    en: "Online",
    fr: "En ligne",
    it: "Online",
    pt: "Online",
  },
  uploadPhoto: {
    es: "Subir foto del espacio (opcional)",
    en: "Upload space photo (optional)",
    fr: "Télécharger une photo de l'espace (optionnel)",
    it: "Carica foto dello spazio (opzionale)",
    pt: "Enviar foto do espaço (opcional)",
  },

  // ── Asesor – Space labels ────────────────────────────────────────────────────
  spaceLabelEstudio: {
    es: "Estudio",
    en: "Studio",
    fr: "Studio",
    it: "Studio",
    pt: "Estúdio",
  },
  spaceLabelHomeStudio: {
    es: "Home Studio",
    en: "Home Studio",
    fr: "Home Studio",
    it: "Home Studio",
    pt: "Home Studio",
  },
  spaceLabelIglesia: {
    es: "Iglesia",
    en: "Church",
    fr: "Église",
    it: "Chiesa",
    pt: "Igreja",
  },
  spaceLabelRestaurante: {
    es: "Restaurante",
    en: "Restaurant",
    fr: "Restaurant",
    it: "Ristorante",
    pt: "Restaurante",
  },
  spaceLabelSonidoVivo: {
    es: "Sonido en vivo",
    en: "Live Sound",
    fr: "Son live",
    it: "Sonoro dal vivo",
    pt: "Som ao vivo",
  },
  spaceLabelOficina: {
    es: "Oficina",
    en: "Office",
    fr: "Bureau",
    it: "Ufficio",
    pt: "Escritório",
  },
  spaceLabelIndustrial: {
    es: "Industrial",
    en: "Industrial",
    fr: "Industriel",
    it: "Industriale",
    pt: "Industrial",
  },

  // ── Asesor – Space selection ─────────────────────────────────────────────────
  selectTitle: {
    es: "¿Qué espacio vamos a optimizar?",
    en: "Which space are we optimizing?",
    fr: "Quel espace allons-nous optimiser ?",
    it: "Quale spazio ottimizziamo?",
    pt: "Qual espaço vamos otimizar?",
  },
  selectSubtitle: {
    es: "Selecciona para comenzar el diagnóstico",
    en: "Select to start the diagnosis",
    fr: "Sélectionnez pour commencer le diagnostic",
    it: "Seleziona per iniziare la diagnosi",
    pt: "Selecione para iniciar o diagnóstico",
  },
  spaceSubEstudio: {
    es: "Grabación profesional",
    en: "Professional recording",
    fr: "Enregistrement professionnel",
    it: "Registrazione professionale",
    pt: "Gravação profissional",
  },
  spaceSubHomeStudio: {
    es: "Producción en casa",
    en: "Home production",
    fr: "Production à domicile",
    it: "Produzione casalinga",
    pt: "Produção em casa",
  },
  spaceSubIglesia: {
    es: "Espacios de culto",
    en: "Worship spaces",
    fr: "Lieux de culte",
    it: "Spazi di culto",
    pt: "Espaços de culto",
  },
  spaceSubRestaurante: {
    es: "Ambiente y confort",
    en: "Ambience and comfort",
    fr: "Ambiance et confort",
    it: "Ambiente e comfort",
    pt: "Ambiente e conforto",
  },
  spaceSubSonidoVivo: {
    es: "Eventos y conciertos",
    en: "Events and concerts",
    fr: "Événements et concerts",
    it: "Eventi e concerti",
    pt: "Eventos e concertos",
  },
  spaceSubOficina: {
    es: "Productividad y foco",
    en: "Productivity and focus",
    fr: "Productivité et concentration",
    it: "Produttività e concentrazione",
    pt: "Produtividade e foco",
  },
  spaceSubIndustrial: {
    es: "Control de ruido",
    en: "Noise control",
    fr: "Contrôle du bruit",
    it: "Controllo del rumore",
    pt: "Controle de ruído",
  },

  // ── Asesor – Calculator screen ───────────────────────────────────────────────
  calcScreenSubtitle: {
    es: "Calculadora de modos de sala",
    en: "Room modes calculator",
    fr: "Calculateur de modes de salle",
    it: "Calcolatore di modi di stanza",
    pt: "Calculadora de modos de sala",
  },
  calcSectionLabel: {
    es: "Modos axiales",
    en: "Axial modes",
    fr: "Modes axiaux",
    it: "Modi assiali",
    pt: "Modos axiais",
  },
  calcTitle: {
    es: "Ingresa las dimensiones de tu espacio",
    en: "Enter your space dimensions",
    fr: "Entrez les dimensions de votre espace",
    it: "Inserisci le dimensioni del tuo spazio",
    pt: "Insira as dimensões do seu espaço",
  },
  calcSubtitle: {
    es: "Calculamos las frecuencias de resonancia usando f = 343 / (2 × dimensión)",
    en: "We calculate resonance frequencies using f = 343 / (2 × dimension)",
    fr: "Nous calculons les fréquences de résonance avec f = 343 / (2 × dimension)",
    it: "Calcoliamo le frequenze di risonanza con f = 343 / (2 × dimensione)",
    pt: "Calculamos as frequências de ressonância usando f = 343 / (2 × dimensão)",
  },
  dimLargo: {
    es: "Largo",
    en: "Length",
    fr: "Longueur",
    it: "Lunghezza",
    pt: "Comprimento",
  },
  dimAncho: {
    es: "Ancho",
    en: "Width",
    fr: "Largeur",
    it: "Larghezza",
    pt: "Largura",
  },
  dimAltura: {
    es: "Altura",
    en: "Height",
    fr: "Hauteur",
    it: "Altezza",
    pt: "Altura",
  },
  calcDimension: {
    es: "Dimensión",
    en: "Dimension",
    fr: "Dimension",
    it: "Dimensione",
    pt: "Dimensão",
  },
  calcModeNote: {
    es: "Los modos f₁ resaltados son los que más afectan tu mezcla. Tratalos primero.",
    en: "The highlighted f₁ modes affect your mix the most. Treat them first.",
    fr: "Les modes f₁ en surbrillance affectent le plus votre mix. Traitez-les en premier.",
    it: "I modi f₁ evidenziati influenzano di più il tuo mix. Trattali per primi.",
    pt: "Os modos f₁ destacados afetam mais seu mix. Trate-os primeiro.",
  },

  // ── Asesor – Industrial screen ───────────────────────────────────────────────
  industrialScreenSubtitle: {
    es: "Normativa de ruido",
    en: "Noise regulation",
    fr: "Réglementation du bruit",
    it: "Normativa sul rumore",
    pt: "Normativa de ruído",
  },
  industrialSectionLabel: {
    es: "Control de ruido industrial",
    en: "Industrial noise control",
    fr: "Contrôle du bruit industriel",
    it: "Controllo del rumore industriale",
    pt: "Controle de ruído industrial",
  },
  industrialTitle: {
    es: "¿En qué país está tu planta?",
    en: "In which country is your facility?",
    fr: "Dans quel pays se trouve votre installation ?",
    it: "In quale paese si trova il tuo impianto?",
    pt: "Em qual país está sua planta?",
  },
  industrialSubtitle: {
    es: "Aplicaremos la normativa local vigente en el diagnóstico",
    en: "We will apply the applicable local regulation in the diagnosis",
    fr: "Nous appliquerons la réglementation locale applicable au diagnostic",
    it: "Applicheremo la normativa locale vigente nella diagnosi",
    pt: "Aplicaremos a normativa local vigente no diagnóstico",
  },
  countryOther: {
    es: "Otro país",
    en: "Other country",
    fr: "Autre pays",
    it: "Altro paese",
    pt: "Outro país",
  },

  // ── Asesor – Chat ────────────────────────────────────────────────────────────
  chatSubtitle: {
    es: "Asesor Acústico · Acustega",
    en: "Acoustic Advisor · Acustega",
    fr: "Conseiller Acoustique · Acustega",
    it: "Consulente Acustico · Acustega",
    pt: "Assessor Acústico · Acustega",
  },
  inputPlaceholder: {
    es: "Escribe tu respuesta...",
    en: "Type your reply...",
    fr: "Écrivez votre réponse...",
    it: "Scrivi la tua risposta...",
    pt: "Escreva sua resposta...",
  },
  errorConnect: {
    es: "Error al conectar con el asesor. Por favor intenta de nuevo.",
    en: "Error connecting to the advisor. Please try again.",
    fr: "Erreur de connexion au conseiller. Veuillez réessayer.",
    it: "Errore di connessione al consulente. Per favore riprova.",
    pt: "Erro ao conectar com o assessor. Por favor, tente novamente.",
  },
  errorCredit: {
    es: "Saldo insuficiente. Por favor contacta al administrador.",
    en: "Insufficient credits. Please contact the administrator.",
    fr: "Solde insuffisant. Veuillez contacter l'administrateur.",
    it: "Credito insufficiente. Si prega di contattare l'amministratore.",
    pt: "Saldo insuficiente. Por favor, contate o administrador.",
  },

  // ── Reporte – General ────────────────────────────────────────────────────────
  reportTitle: {
    es: "Reporte Profesional",
    en: "Professional Report",
    fr: "Rapport Professionnel",
    it: "Rapporto Professionale",
    pt: "Relatório Profissional",
  },
  reportTitleAccent: {
    es: "de Acústica",
    en: "of Acoustics",
    fr: "d'Acoustique",
    it: "di Acustica",
    pt: "de Acústica",
  },
  reportSubtitle: {
    es: "Genera un PDF completo con diagnóstico, plan de tratamiento, materiales y presupuesto basado en tu conversación con el asesor.",
    en: "Generate a complete PDF with diagnosis, treatment plan, materials and budget based on your conversation with the advisor.",
    fr: "Générez un PDF complet avec diagnostic, plan de traitement, matériaux et budget basé sur votre conversation avec le conseiller.",
    it: "Genera un PDF completo con diagnosi, piano di trattamento, materiali e budget basato sulla tua conversazione con il consulente.",
    pt: "Gere um PDF completo com diagnóstico, plano de tratamento, materiais e orçamento baseado em sua conversa com o assessor.",
  },
  reportSpace: {
    es: "Espacio",
    en: "Space",
    fr: "Espace",
    it: "Spazio",
    pt: "Espaço",
  },
  reportNoConversation: {
    es: "Completa una consulta con el asesor antes de generar el reporte.",
    en: "Complete a consultation with the advisor before generating the report.",
    fr: "Complétez une consultation avec le conseiller avant de générer le rapport.",
    it: "Completa una consulenza con il consulente prima di generare il rapporto.",
    pt: "Conclua uma consulta com o assessor antes de gerar o relatório.",
  },
  reportSuccess: {
    es: "🎛️ Reporte descargado exitosamente",
    en: "🎛️ Report downloaded successfully",
    fr: "🎛️ Rapport téléchargé avec succès",
    it: "🎛️ Rapporto scaricato con successo",
    pt: "🎛️ Relatório baixado com sucesso",
  },
  reportBundleLabel: {
    es: "RECOMENDADO",
    en: "RECOMMENDED",
    fr: "RECOMMANDÉ",
    it: "CONSIGLIATO",
    pt: "RECOMENDADO",
  },
  reportBundleBtn: {
    es: "Reporte PDF + Prompt de diseño · $13.99",
    en: "PDF Report + Design Prompt · $13.99",
    fr: "Rapport PDF + Prompt de design · $13.99",
    it: "Rapporto PDF + Prompt di design · $13.99",
    pt: "Relatório PDF + Prompt de design · $13.99",
  },
  reportBundleSubtext: {
    es: "Incluye prompt para visualizar tu espacio con IA",
    en: "Includes prompt to visualize your space with AI",
    fr: "Inclut un prompt pour visualiser votre espace avec l'IA",
    it: "Include prompt per visualizzare il tuo spazio con l'IA",
    pt: "Inclui prompt para visualizar seu espaço com IA",
  },
  reportPdfBtn: {
    es: "Solo reporte PDF · $9.99",
    en: "PDF report only · $9.99",
    fr: "Rapport PDF seulement · $9.99",
    it: "Solo rapporto PDF · $9.99",
    pt: "Somente relatório PDF · $9.99",
  },
  reportFooter: {
    es: "Pago seguro con Stripe · PDF generado con IA · Acustega AI",
    en: "Secure payment with Stripe · AI-generated PDF · Acustega AI",
    fr: "Paiement sécurisé avec Stripe · PDF généré par IA · Acustega AI",
    it: "Pagamento sicuro con Stripe · PDF generato con IA · Acustega AI",
    pt: "Pagamento seguro com Stripe · PDF gerado com IA · Acustega AI",
  },
  goToAdvisor: {
    es: "Ir al asesor →",
    en: "Go to advisor →",
    fr: "Aller au conseiller →",
    it: "Vai al consulente →",
    pt: "Ir ao assessor →",
  },
  reportHeaderTitle: {
    es: "Reporte Acústico",
    en: "Acoustic Report",
    fr: "Rapport Acoustique",
    it: "Rapporto Acustico",
    pt: "Relatório Acústico",
  },
  reportIncludesLabel: {
    es: "Incluye",
    en: "Includes",
    fr: "Comprend",
    it: "Include",
    pt: "Inclui",
  },
  reportPagesLabel: {
    es: "Páginas del reporte",
    en: "Report pages",
    fr: "Pages du rapport",
    it: "Pagine del rapporto",
    pt: "Páginas do relatório",
  },
  reportPriceLabel: {
    es: "USD",
    en: "USD",
    fr: "USD",
    it: "USD",
    pt: "USD",
  },

  // ── Reporte – Loading overlay ────────────────────────────────────────────────
  reportLoadingFooter: {
    es: "Generando tu reporte acústico...",
    en: "Generating your acoustic report...",
    fr: "Génération de votre rapport acoustique...",
    it: "Generazione del tuo rapporto acustico...",
    pt: "Gerando seu relatório acústico...",
  },

  // ── Reporte – Upsell overlay ─────────────────────────────────────────────────
  upsellStep: {
    es: "Un paso más",
    en: "One more step",
    fr: "Une étape de plus",
    it: "Un altro passo",
    pt: "Mais um passo",
  },
  upsellTitle1: {
    es: "Tu espacio ya tiene diagnóstico.",
    en: "Your space now has a diagnosis.",
    fr: "Votre espace a maintenant un diagnostic.",
    it: "Il tuo spazio ha ora una diagnosi.",
    pt: "Seu espaço já tem diagnóstico.",
  },
  upsellTitle2: {
    es: "Ahora visualízalo.",
    en: "Now visualize it.",
    fr: "Maintenant visualisez-le.",
    it: "Ora visualizzalo.",
    pt: "Agora visualize-o.",
  },
  upsellDesc: {
    es: "Genera un prompt detallado para crear renders de tu espacio optimizado usando Midjourney, DALL·E o cualquier IA de imagen.",
    en: "Generate a detailed prompt to create renders of your optimized space using Midjourney, DALL·E or any image AI.",
    fr: "Générez un prompt détaillé pour créer des rendus de votre espace optimisé avec Midjourney, DALL·E ou toute IA d'image.",
    it: "Genera un prompt dettagliato per creare render del tuo spazio ottimizzato con Midjourney, DALL·E o qualsiasi IA per immagini.",
    pt: "Gere um prompt detalhado para criar renders do seu espaço otimizado usando Midjourney, DALL·E ou qualquer IA de imagem.",
  },
  upsellBtn: {
    es: "Generar prompt de diseño · $4.99",
    en: "Generate design prompt · $4.99",
    fr: "Générer prompt de design · $4.99",
    it: "Genera prompt di design · $4.99",
    pt: "Gerar prompt de design · $4.99",
  },
  upsellProcessing: {
    es: "Procesando pago...",
    en: "Processing payment...",
    fr: "Traitement du paiement...",
    it: "Elaborazione pagamento...",
    pt: "Processando pagamento...",
  },
  upsellDismiss: {
    es: "No gracias, solo el reporte",
    en: "No thanks, just the report",
    fr: "Non merci, juste le rapport",
    it: "No grazie, solo il rapporto",
    pt: "Não obrigado, só o relatório",
  },
  upsellPromptReady: {
    es: "Prompt listo",
    en: "Prompt ready",
    fr: "Prompt prêt",
    it: "Prompt pronto",
    pt: "Prompt pronto",
  },
  upsellPromptSubtitle: {
    es: "Copia y pega en Midjourney o DALL·E",
    en: "Copy and paste into Midjourney or DALL·E",
    fr: "Copiez et collez dans Midjourney ou DALL·E",
    it: "Copia e incolla in Midjourney o DALL·E",
    pt: "Copie e cole no Midjourney ou DALL·E",
  },
  upsellCopy: {
    es: "Copiar prompt",
    en: "Copy prompt",
    fr: "Copier le prompt",
    it: "Copia prompt",
    pt: "Copiar prompt",
  },
  upsellCopied: {
    es: "¡Copiado!",
    en: "Copied!",
    fr: "Copié !",
    it: "Copiato!",
    pt: "Copiado!",
  },
  upsellClose: {
    es: "Cerrar",
    en: "Close",
    fr: "Fermer",
    it: "Chiudi",
    pt: "Fechar",
  },
  upsellGenerating: {
    es: "Generando prompt de diseño...",
    en: "Generating design prompt...",
    fr: "Génération du prompt de design...",
    it: "Generazione del prompt di design...",
    pt: "Gerando prompt de design...",
  },
  upsellGeneratingDesc: {
    es: "Analizando tu espacio con IA",
    en: "Analyzing your space with AI",
    fr: "Analyse de votre espace avec l'IA",
    it: "Analisi del tuo spazio con IA",
    pt: "Analisando seu espaço com IA",
  },
} as const;

type UIKey = keyof typeof ui;

export function t(locale: Locale, key: UIKey): string {
  return ui[key][locale];
}

// ── Feature cards (reporte) ───────────────────────────────────────────────────

export function getFeatures(locale: Locale) {
  const data: Record<Locale, Array<{ title: string; desc: string }>> = {
    es: [
      { title: "Diagnóstico acústico",    desc: "Resumen detallado de los problemas identificados en tu espacio." },
      { title: "Plan de tratamiento",     desc: "Recomendaciones específicas de aislamiento, absorción y difusión." },
      { title: "Lista de materiales",     desc: "Materiales recomendados con proveedores locales por país." },
      { title: "Tabla de presupuesto",    desc: "Rangos de costo en USD con opciones económicas y premium." },
      { title: "Próximos pasos",          desc: "Plan de acción numerado para implementar las mejoras acústicas." },
      { title: "Portada profesional",     desc: "Reporte con marca Acustega AI, espacio, ciudad y fecha." },
    ],
    en: [
      { title: "Acoustic diagnosis",      desc: "Detailed summary of the problems identified in your space." },
      { title: "Treatment plan",          desc: "Specific recommendations for isolation, absorption and diffusion." },
      { title: "Materials list",          desc: "Recommended materials with local suppliers by country." },
      { title: "Budget table",            desc: "USD cost ranges with economic and premium options." },
      { title: "Next steps",              desc: "Numbered action plan to implement acoustic improvements." },
      { title: "Professional cover",      desc: "Report with Acustega AI branding, space, city and date." },
    ],
    fr: [
      { title: "Diagnostic acoustique",   desc: "Résumé détaillé des problèmes identifiés dans votre espace." },
      { title: "Plan de traitement",      desc: "Recommandations spécifiques pour l'isolation, l'absorption et la diffusion." },
      { title: "Liste de matériaux",      desc: "Matériaux recommandés avec fournisseurs locaux par pays." },
      { title: "Tableau budgétaire",      desc: "Fourchettes de coûts en USD avec options économiques et premium." },
      { title: "Prochaines étapes",       desc: "Plan d'action numéroté pour implémenter les améliorations acoustiques." },
      { title: "Couverture professionnelle", desc: "Rapport avec la marque Acustega AI, espace, ville et date." },
    ],
    it: [
      { title: "Diagnosi acustica",       desc: "Sommario dettagliato dei problemi identificati nel tuo spazio." },
      { title: "Piano di trattamento",    desc: "Raccomandazioni specifiche per isolamento, assorbimento e diffusione." },
      { title: "Lista materiali",         desc: "Materiali consigliati con fornitori locali per paese." },
      { title: "Tabella del budget",      desc: "Fasce di costo in USD con opzioni economiche e premium." },
      { title: "Prossimi passi",          desc: "Piano d'azione numerato per implementare i miglioramenti acustici." },
      { title: "Copertina professionale", desc: "Rapporto con marchio Acustega AI, spazio, città e data." },
    ],
    pt: [
      { title: "Diagnóstico acústico",    desc: "Resumo detalhado dos problemas identificados no seu espaço." },
      { title: "Plano de tratamento",     desc: "Recomendações específicas de isolamento, absorção e difusão." },
      { title: "Lista de materiais",      desc: "Materiais recomendados com fornecedores locais por país." },
      { title: "Tabela de orçamento",     desc: "Faixas de custo em USD com opções econômicas e premium." },
      { title: "Próximos passos",         desc: "Plano de ação numerado para implementar as melhorias acústicas." },
      { title: "Capa profissional",       desc: "Relatório com marca Acustega AI, espaço, cidade e data." },
    ],
  };
  return data[locale];
}

// ── Loading messages (reporte) ────────────────────────────────────────────────

export function getLoadingMessages(locale: Locale): string[] {
  const data: Record<Locale, string[]> = {
    es: [
      "Calibrando los monitores de tu espacio...",
      "Calculando cuántos dB necesitas para molestar a tus vecinos...",
      "Midiendo el tiempo de reverberación... suena a cueva de Batman",
      "Consultando a Dolby sobre tus esquinas...",
      "Absorbiendo las frecuencias problemáticas con lana mineral virtual...",
      "Tu flutter echo tiene flutter echo...",
      "Aplicando la regla de oro: si suena mal, agrega más trampa de graves",
      "Generando el PDF con máxima fidelidad... 24 bits, 192kHz",
      "Casi listo... esperando que el bus de mezcla termine de procesar",
    ],
    en: [
      "Calibrating your space monitors...",
      "Calculating how many dB you need to annoy your neighbors...",
      "Measuring reverberation time... sounds like Batman's cave",
      "Consulting Dolby about your corners...",
      "Absorbing problematic frequencies with virtual mineral wool...",
      "Your flutter echo has flutter echo...",
      "Applying the golden rule: if it sounds bad, add more bass traps",
      "Generating the PDF with maximum fidelity... 24 bit, 192kHz",
      "Almost done... waiting for the mix bus to finish processing",
    ],
    fr: [
      "Calibrage des moniteurs de votre espace...",
      "Calcul du nombre de dB nécessaires pour agacer vos voisins...",
      "Mesure du temps de réverbération... ça ressemble à la grotte de Batman",
      "Consultation de Dolby sur vos coins...",
      "Absorption des fréquences problématiques avec de la laine minérale virtuelle...",
      "Votre flutter echo a un flutter echo...",
      "Application de la règle d'or : si ça sonne mal, ajoutez des pièges à basses",
      "Génération du PDF avec une fidélité maximale... 24 bits, 192kHz",
      "Presque prêt... en attente que le bus de mixage finisse de traiter",
    ],
    it: [
      "Calibrazione dei monitor del tuo spazio...",
      "Calcolo dei dB necessari per disturbare i tuoi vicini...",
      "Misurazione del tempo di riverbero... sembra la grotta di Batman",
      "Consultazione con Dolby sugli angoli...",
      "Assorbimento delle frequenze problematiche con lana minerale virtuale...",
      "Il tuo flutter echo ha un flutter echo...",
      "Applicazione della regola d'oro: se suona male, aggiungi bass trap",
      "Generazione del PDF con massima fedeltà... 24 bit, 192kHz",
      "Quasi pronto... in attesa che il bus di mixaggio finisca di elaborare",
    ],
    pt: [
      "Calibrando os monitores do seu espaço...",
      "Calculando quantos dB você precisa para incomodar seus vizinhos...",
      "Medindo o tempo de reverberação... parece a caverna do Batman",
      "Consultando a Dolby sobre seus cantos...",
      "Absorvendo as frequências problemáticas com lã mineral virtual...",
      "Seu flutter echo tem flutter echo...",
      "Aplicando a regra de ouro: se soa mal, adicione mais armadilha de graves",
      "Gerando o PDF com máxima fidelidade... 24 bits, 192kHz",
      "Quase pronto... aguardando o barramento de mixagem terminar de processar",
    ],
  };
  return data[locale];
}

// ── Report page previews ──────────────────────────────────────────────────────

export function getPagePreviews(locale: Locale) {
  const data: Record<Locale, Array<{ num: string; label: string }>> = {
    es: [
      { num: "01", label: "Portada" },
      { num: "02", label: "Diagnóstico" },
      { num: "03", label: "Tratamiento" },
      { num: "04", label: "Materiales" },
      { num: "05", label: "Presupuesto" },
      { num: "06", label: "Próximos pasos" },
    ],
    en: [
      { num: "01", label: "Cover" },
      { num: "02", label: "Diagnosis" },
      { num: "03", label: "Treatment" },
      { num: "04", label: "Materials" },
      { num: "05", label: "Budget" },
      { num: "06", label: "Next steps" },
    ],
    fr: [
      { num: "01", label: "Couverture" },
      { num: "02", label: "Diagnostic" },
      { num: "03", label: "Traitement" },
      { num: "04", label: "Matériaux" },
      { num: "05", label: "Budget" },
      { num: "06", label: "Étapes suivantes" },
    ],
    it: [
      { num: "01", label: "Copertina" },
      { num: "02", label: "Diagnosi" },
      { num: "03", label: "Trattamento" },
      { num: "04", label: "Materiali" },
      { num: "05", label: "Budget" },
      { num: "06", label: "Prossimi passi" },
    ],
    pt: [
      { num: "01", label: "Capa" },
      { num: "02", label: "Diagnóstico" },
      { num: "03", label: "Tratamento" },
      { num: "04", label: "Materiais" },
      { num: "05", label: "Orçamento" },
      { num: "06", label: "Próximos passos" },
    ],
  };
  return data[locale];
}
