import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECTS: Record<string, string> = {
  es: "Tu Reporte Acústico - Acustega AI",
  en: "Your Acoustic Report - Acustega AI",
  fr: "Votre Rapport Acoustique - Acustega AI",
  it: "Il Tuo Rapporto Acustico - Acustega AI",
  pt: "Seu Relatório Acústico - Acustega AI",
};

const BODIES: Record<string, (space: string) => string> = {
  es: (space) => `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0D1117;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0">
        <p style="color:#8B949E;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">
          ACUSTEGA<span style="color:#00B4D8">AI</span>
        </p>
        <h1 style="color:#F0F6FC;font-size:20px;margin:0">Reporte Acústico</h1>
        <p style="color:#00B4D8;font-size:13px;margin:8px 0 0">${space}</p>
      </div>
      <div style="background:#ffffff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          ¡Hola! Aquí tienes tu reporte acústico profesional.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 16px">
          Adjunto encontrarás tu PDF con diagnóstico detallado, plan de tratamiento,
          lista de materiales con proveedores locales, tabla de presupuesto y próximos pasos.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 24px">
          Si tienes dudas o necesitas una consulta personalizada, escríbenos a
          <a href="mailto:hola@acustega.com" style="color:#00B4D8">hola@acustega.com</a>.
        </p>
        <p style="font-size:13px;color:#9ca3af;margin:0">
          — Equipo Acustega AI · Medellín, Colombia
        </p>
      </div>
    </div>
  `,
  en: (space) => `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0D1117;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0">
        <p style="color:#8B949E;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">
          ACUSTEGA<span style="color:#00B4D8">AI</span>
        </p>
        <h1 style="color:#F0F6FC;font-size:20px;margin:0">Acoustic Report</h1>
        <p style="color:#00B4D8;font-size:13px;margin:8px 0 0">${space}</p>
      </div>
      <div style="background:#ffffff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Hi! Here is your professional acoustic report.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 16px">
          Attached you will find your PDF with detailed diagnosis, treatment plan,
          materials list with local suppliers, budget table and next steps.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 24px">
          If you have any questions or need a personalized consultation, reach us at
          <a href="mailto:hola@acustega.com" style="color:#00B4D8">hola@acustega.com</a>.
        </p>
        <p style="font-size:13px;color:#9ca3af;margin:0">
          — Acustega AI Team · Medellín, Colombia
        </p>
      </div>
    </div>
  `,
  fr: (space) => `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0D1117;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0">
        <p style="color:#8B949E;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">
          ACUSTEGA<span style="color:#00B4D8">AI</span>
        </p>
        <h1 style="color:#F0F6FC;font-size:20px;margin:0">Rapport Acoustique</h1>
        <p style="color:#00B4D8;font-size:13px;margin:8px 0 0">${space}</p>
      </div>
      <div style="background:#ffffff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Bonjour ! Voici votre rapport acoustique professionnel.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 16px">
          Vous trouverez en pièce jointe votre PDF avec diagnostic détaillé, plan de traitement,
          liste de matériaux avec fournisseurs locaux, tableau budgétaire et prochaines étapes.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 24px">
          Pour toute question ou consultation personnalisée, contactez-nous à
          <a href="mailto:hola@acustega.com" style="color:#00B4D8">hola@acustega.com</a>.
        </p>
        <p style="font-size:13px;color:#9ca3af;margin:0">
          — Équipe Acustega AI · Medellín, Colombie
        </p>
      </div>
    </div>
  `,
  it: (space) => `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0D1117;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0">
        <p style="color:#8B949E;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">
          ACUSTEGA<span style="color:#00B4D8">AI</span>
        </p>
        <h1 style="color:#F0F6FC;font-size:20px;margin:0">Rapporto Acustico</h1>
        <p style="color:#00B4D8;font-size:13px;margin:8px 0 0">${space}</p>
      </div>
      <div style="background:#ffffff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Ciao! Ecco il tuo rapporto acustico professionale.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 16px">
          In allegato troverai il tuo PDF con diagnosi dettagliata, piano di trattamento,
          lista di materiali con fornitori locali, tabella del budget e prossimi passi.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 24px">
          Per domande o una consulenza personalizzata, scrivici a
          <a href="mailto:hola@acustega.com" style="color:#00B4D8">hola@acustega.com</a>.
        </p>
        <p style="font-size:13px;color:#9ca3af;margin:0">
          — Team Acustega AI · Medellín, Colombia
        </p>
      </div>
    </div>
  `,
  pt: (space) => `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0D1117;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0">
        <p style="color:#8B949E;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">
          ACUSTEGA<span style="color:#00B4D8">AI</span>
        </p>
        <h1 style="color:#F0F6FC;font-size:20px;margin:0">Relatório Acústico</h1>
        <p style="color:#00B4D8;font-size:13px;margin:8px 0 0">${space}</p>
      </div>
      <div style="background:#ffffff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Olá! Aqui está o seu relatório acústico profissional.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 16px">
          Em anexo você encontrará seu PDF com diagnóstico detalhado, plano de tratamento,
          lista de materiais com fornecedores locais, tabela de orçamento e próximos passos.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 24px">
          Se tiver dúvidas ou precisar de uma consulta personalizada, escreva para
          <a href="mailto:hola@acustega.com" style="color:#00B4D8">hola@acustega.com</a>.
        </p>
        <p style="font-size:13px;color:#9ca3af;margin:0">
          — Equipe Acustega AI · Medellín, Colômbia
        </p>
      </div>
    </div>
  `,
};

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: "RESEND_API_KEY is not configured" }, { status: 500 });
  }

  const { pdfBase64, email, spaceLabel, locale } = await req.json() as {
    pdfBase64: string;
    email: string;
    spaceLabel: string;
    locale?: string;
  };

  if (!pdfBase64 || !email) {
    return Response.json({ error: "pdfBase64 and email are required" }, { status: 400 });
  }

  const lang = locale && SUBJECTS[locale] ? locale : "es";
  const subject = SUBJECTS[lang];
  const html = BODIES[lang](spaceLabel ?? "Espacio");
  const filename = `reporte-acustico-${(spaceLabel ?? "espacio").toLowerCase().replace(/\s+/g, "-")}.pdf`;

  try {
    const { error } = await resend.emails.send({
      from: "Acustega AI <reportes@acustega.com>",
      to: email,
      subject,
      html,
      attachments: [
        {
          filename,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("[Email] Sent to:", email);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[Email] Unexpected error:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
