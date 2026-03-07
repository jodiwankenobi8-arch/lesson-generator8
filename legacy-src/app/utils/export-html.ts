import type { GeneratedLessonPlan, LessonPlanBlock } from '../types/lesson-schema';
import type { CentersPlan } from './centers-planner';

function esc(s: any): string {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function openPrintWindow(html: string, title = 'Print') {
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.document.title = title;
  // Give the browser a tick to render
  setTimeout(() => w.print(), 250);
}

function baseDoc(title: string, body: string) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111; margin: 0; padding: 24px; }
  h1 { font-size: 22px; margin: 0 0 6px; }
  h2 { font-size: 16px; margin: 18px 0 8px; }
  h3 { font-size: 14px; margin: 12px 0 6px; }
  .muted { color: #555; font-size: 12px; }
  .card { border: 1px solid #ddd; border-radius: 12px; padding: 14px; margin: 12px 0; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  ul { margin: 6px 0 0 18px; }
  .pill { display: inline-block; border: 1px solid #ddd; padding: 2px 8px; border-radius: 999px; font-size: 12px; margin-right: 6px; }
  .page { page-break-after: always; }
  .slide { border: 1px solid #ddd; border-radius: 14px; padding: 28px; height: 9.2in; width: 7.2in; box-sizing: border-box; margin: 0 auto 18px; }
  .slide h1 { font-size: 34px; margin-bottom: 10px; }
  .slide h2 { font-size: 28px; margin: 0 0 10px; }
  .slide ul { font-size: 24px; line-height: 1.25; }
  @media print {
    body { padding: 0.35in; }
    .no-print { display: none !important; }
    .slide { margin: 0 auto; page-break-after: always; }
  }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

export function teacherPlanHtml(plan: GeneratedLessonPlan, centers?: CentersPlan) {
  const blocks = (plan.blocks || []).map((b: LessonPlanBlock) => {
    const diff = b.differentiation;
    const diffHtml = diff ? `
      <div class="grid">
        <div class="card"><h3>Intervention</h3><ul>${(diff.intervention||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="card"><h3>ELL</h3><ul>${(diff.ell||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="card"><h3>Extension</h3><ul>${(diff.extension||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      </div>` : '';
    return `<div class="card">
      <h2>${esc(b.title)} <span class="pill">${esc(b.minutes)} min</span></h2>
      ${b.materials?.length ? `<h3>Materials</h3><ul>${b.materials.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${b.teacherSays?.length ? `<h3>Teacher</h3><ul>${b.teacherSays.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${b.studentsDo?.length ? `<h3>Students</h3><ul>${b.studentsDo.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${b.checksForUnderstanding?.length ? `<h3>Checks</h3><ul>${b.checksForUnderstanding.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${diffHtml}
    </div>`;
  }).join('');

  const ie = plan.ieSuggestions;
  const ieSection = ie ? `<div class="card">
    <h2>I/E Suggestions <span class="pill">${esc(ie.window)}</span></h2>
    ${(ie.tier3?.length||0) ? `<h3>Tier 3</h3><ul>${ie.tier3!.flatMap(g => [`<li><strong>${esc(g.groupName)}</strong>: ${(g.suggestedActivities||[]).slice(0,4).map(esc).join('; ')}</li>`]).join('')}</ul>` : ''}
    ${(ie.tier2?.length||0) ? `<h3>Tier 2</h3><ul>${ie.tier2!.flatMap(g => [`<li><strong>${esc(g.groupName)}</strong>: ${(g.suggestedActivities||[]).slice(0,4).map(esc).join('; ')}</li>`]).join('')}</ul>` : ''}
    ${(ie.enrichment?.length||0) ? `<h3>Enrichment</h3><ul>${ie.enrichment!.flatMap(g => [`<li><strong>${esc(g.groupName)}</strong>: ${(g.suggestedActivities||[]).slice(0,4).map(esc).join('; ')}</li>`]).join('')}</ul>` : ''}
    ${(ie.notes?.length||0) ? `<h3>Notes</h3><ul>${ie.notes!.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>` : ''}
  </div>` : '';

  const centersSection = centers ? `<div class="card">
    <h2>Centers Rotation</h2>
    <div class="muted">Rounds: ${esc(centers.rounds)} • Centers: ${centers.centers.map(esc).join(' • ')}</div>
    <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Round</th>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Group</th>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Center</th>
        </tr>
      </thead>
      <tbody>
        ${centers.rotations.map(r => `<tr>
          <td style="border-bottom:1px solid #eee; padding:6px;">${esc(r.round)}</td>
          <td style="border-bottom:1px solid #eee; padding:6px;">${esc(r.groupName)}</td>
          <td style="border-bottom:1px solid #eee; padding:6px;">${esc(r.centerName)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    ${(centers.notes?.length||0) ? `<h3>Notes</h3><ul>${centers.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>` : ''}
  </div>` : '';

  const header = `<h1>${esc(plan.title)}</h1>
  <div class="muted">${esc(plan.subject)} • Grade ${esc(plan.grade)}${plan.date ? ` • ${esc(plan.date)}` : ''}</div>
  <div class="card">
    <h2>Objectives</h2>
    <ul>${plan.objectives.map(o=>`<li>${esc(o)}</li>`).join('')}</ul>
    ${(plan.standards?.length||0) ? `<h3>Standards (FL B.E.S.T.)</h3><ul>${plan.standards!.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>` : ''}
    <h3>Materials</h3>
    <ul>${plan.materials.map(m=>`<li>${esc(m)}</li>`).join('')}</ul>
  </div>`;

  return baseDoc(plan.title + ' — Teacher Plan', header + ieSection + centersSection + blocks);
}

export function centersPacketHtml(plan: GeneratedLessonPlan, centers: CentersPlan) {
  const focus = plan.objectives?.[0] || plan.blocks?.[0]?.title || '';
  const cards = centers.centers.map(c => `<div class="card">
    <h2>${esc(c)}</h2>
    <div class="muted">Focus: ${esc(focus)}</div>
    <h3>Directions</h3>
    <ul>
      <li>Start right away.</li>
      <li>Do your best work.</li>
      <li>When finished, read your book or write quietly.</li>
    </ul>
    <h3>Teacher tweak</h3>
    <ul>
      <li>Add a “must-do” and a “may-do” for fast finishers.</li>
      <li>Use the I/E suggestions for targeted tasks.</li>
    </ul>
  </div>`).join('');

  const rotation = `<div class="card">
    <h2>Rotation Chart</h2>
    <div class="muted">Rounds: ${esc(centers.rounds)}</div>
    <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Round</th>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Group</th>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Center</th>
        </tr>
      </thead>
      <tbody>
        ${centers.rotations.map(r => `<tr>
          <td style="border-bottom:1px solid #eee; padding:6px;">${esc(r.round)}</td>
          <td style="border-bottom:1px solid #eee; padding:6px;">${esc(r.groupName)}</td>
          <td style="border-bottom:1px solid #eee; padding:6px;">${esc(r.centerName)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  return baseDoc(plan.title + ' — Centers Packet', `<h1>${esc(plan.title)} — Centers Packet</h1><div class="muted">${esc(plan.date||'')}</div>` + rotation + cards);
}

export function interventionsPacketHtml(plan: GeneratedLessonPlan) {
  const ie = plan.ieSuggestions;
  const rows = (label: string, arr?: any[]) => (arr?.length ? `<div class="card"><h2>${esc(label)}</h2>${arr.map(g=>`<h3>${esc(g.groupName)}</h3><ul>${(g.suggestedActivities||[]).slice(0,6).map(a=>`<li>${esc(a)}</li>`).join('')}</ul>`).join('')}</div>` : '');
  const body = `<h1>${esc(plan.title)} — Intervention & Enrichment</h1>
  <div class="muted">${esc(plan.date||'')}</div>
  ${ie ? `<div class="muted">Window: ${esc(ie.window)}</div>` : '<div class="muted">No I/E suggestions found. Generate again after adding group notes in Setup.</div>'}
  ${rows('Tier 3 (Intensive)', ie?.tier3)}
  ${rows('Tier 2 (Targeted)', ie?.tier2)}
  ${rows('Enrichment', ie?.enrichment)}
  `;
  return baseDoc(plan.title + ' — Intervention & Enrichment', body);
}

export function centersRotationSlidesHtml(plan: GeneratedLessonPlan, centers: CentersPlan) {
  // Print-friendly "slides" (one page per round)
  const pages = Array.from({ length: centers.rounds }).map((_, r) => {
    const round = r + 1;
    const rows = centers.rotations.filter(x => x.round === round);
    return `<div class="slide">
      <h1>Centers Rotation</h1>
      <h2>Round ${esc(round)}</h2>
      <ul>
        ${rows.map(row => `<li><strong>${esc(row.groupName)}</strong> → ${esc(row.centerName)}</li>`).join('')}
      </ul>
    </div>`;
  }).join('');
  return baseDoc(plan.title + ' — Rotation Slides', `<div class="no-print"><h1>${esc(plan.title)} — Rotation Slides</h1><div class="muted">Use Print → Save as PDF</div></div>${pages}`);
}
