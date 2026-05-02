import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

/*
  PREREQUISITO (ejecutar UNA VEZ en el SQL Editor de Supabase):

  create or replace function exec_sql(sql text)
  returns void language plpgsql security definer as $$
  begin execute sql; end; $$;

  También requiere SUPABASE_SERVICE_ROLE_KEY en .env.local
  (disponible en Supabase → Project Settings → API → service_role)
*/

const ADMIN_PASSWORD = "acustega2026";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function runSQL(supabase: ReturnType<typeof adminClient>, sql: string) {
  const { error } = await supabase.rpc("exec_sql", { sql });
  return error ? error.message : null;
}

// ── Table DDL ─────────────────────────────────────────────────────────────────

const TABLES: { name: string; sql: string }[] = [
  {
    name: "acustega_proyectos",
    sql: `
      create table if not exists acustega_proyectos (
        id                uuid primary key default gen_random_uuid(),
        nombre            text not null,
        tipo_espacio      text not null,
        ciudad            text,
        pais              text,
        artista           text,
        descripcion       text,
        largo_m           numeric,
        ancho_m           numeric,
        alto_m            numeric,
        superficie_m2     numeric generated always as (largo_m * ancho_m) stored,
        volumen_m3        numeric generated always as (largo_m * ancho_m * alto_m) stored,
        uso_principal     text,
        año_construccion  integer,
        presupuesto_usd   numeric,
        estado            text not null default 'activo'
                            check (estado in ('activo', 'archivado')),
        created_at        timestamptz not null default now(),
        updated_at        timestamptz not null default now()
      );
    `,
  },
  {
    name: "acustega_proveedores",
    sql: `
      create table if not exists acustega_proveedores (
        id                   uuid primary key default gen_random_uuid(),
        nombre               text not null,
        pais                 text not null,
        ciudad               text,
        tipo                 text not null
                               check (tipo in ('fabricante', 'distribuidor', 'importador')),
        categorias_material  text[]  not null default '{}',
        contacto_email       text,
        sitio_web            text,
        telefono             text,
        notas                text,
        activo               boolean not null default true,
        created_at           timestamptz not null default now()
      );
    `,
  },
  {
    name: "acustega_materiales",
    sql: `
      create table if not exists acustega_materiales (
        id                uuid primary key default gen_random_uuid(),
        nombre            text not null,
        marca             text,
        tipo              text not null
                            check (tipo in (
                              'absorbente', 'difusor', 'aislante',
                              'trampa_graves', 'panel_perforado', 'membrana'
                            )),
        subtipo           text,
        descripcion       text,
        absorcion_125hz   numeric check (absorcion_125hz between 0 and 1.2),
        absorcion_250hz   numeric check (absorcion_250hz between 0 and 1.2),
        absorcion_500hz   numeric check (absorcion_500hz between 0 and 1.2),
        absorcion_1000hz  numeric check (absorcion_1000hz between 0 and 1.2),
        absorcion_2000hz  numeric check (absorcion_2000hz between 0 and 1.2),
        absorcion_4000hz  numeric check (absorcion_4000hz between 0 and 1.2),
        nrc               numeric check (nrc between 0 and 1),
        stc               integer,
        espesor_cm        numeric,
        densidad_kg_m3    numeric,
        precio_usd_m2     numeric,
        proveedor_id      uuid references acustega_proveedores (id) on delete set null,
        disponible_latam  boolean not null default true,
        aplicaciones      text[]  not null default '{}',
        notas             text,
        created_at        timestamptz not null default now()
      );
    `,
  },
  {
    name: "acustega_resultados",
    sql: `
      create table if not exists acustega_resultados (
        id                       uuid primary key default gen_random_uuid(),
        proyecto_id              uuid not null references acustega_proyectos (id) on delete cascade,
        tipo_problema            text not null
                                   check (tipo_problema in (
                                     'flutter_echo', 'modos_sala', 'reverb_excesiva',
                                     'reflexiones_tempranas', 'comb_filtering', 'ruido_externo',
                                     'otro'
                                   )),
        frecuencias_problematicas text,
        descripcion_problema      text,
        solucion_aplicada         text not null,
        materiales_utilizados     uuid[],
        rt60_objetivo_ms          integer,
        rt60_antes_ms             integer,
        rt60_despues_ms           integer,
        frecuencia_ref_hz         integer not null default 500,
        efectividad               integer check (efectividad between 1 and 10),
        costo_total_usd           numeric,
        tiempo_instalacion_dias   integer,
        lecciones_aprendidas      text,
        recomendaciones           text,
        created_at                timestamptz not null default now()
      );
    `,
  },
];

// ── Column migrations (idempotent) ───────────────────────────────────────────

const MIGRATIONS: string[] = [
  `alter table acustega_proyectos add column if not exists materiales_usados text`,
  `alter table acustega_proyectos add column if not exists notas text`,
  `alter table acustega_proyectos add column if not exists fotos_urls text[] default '{}'`,
  `alter table acustega_proveedores add column if not exists precios_referencia text`,
  `alter table acustega_materiales add column if not exists paises_disponibles text`,
  `alter table acustega_resultados add column if not exists stc_resultado integer`,
  `alter table acustega_resultados add column if not exists notas text`,
  `alter table acustega_resultados add column if not exists testimonial text`,
];

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { password } = await req.json() as { password: string };

  if (password !== ADMIN_PASSWORD) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      { error: "Falta SUPABASE_SERVICE_ROLE_KEY en .env.local" },
      { status: 500 }
    );
  }

  const supabase = adminClient();
  const results: Record<string, "ok" | string> = {};

  for (const table of TABLES) {
    const err = await runSQL(supabase, table.sql);
    results[table.name] = err ?? "ok";
  }

  const migrationErrors: string[] = [];
  for (const sql of MIGRATIONS) {
    const err = await runSQL(supabase, sql);
    if (err) migrationErrors.push(err);
  }
  if (migrationErrors.length) results["migrations"] = migrationErrors.join("; ");
  else results["migrations"] = "ok";

  const allOk = Object.values(results).every((v) => v === "ok");

  return Response.json(
    { ok: allOk, tables: results },
    { status: allOk ? 200 : 500 }
  );
}
