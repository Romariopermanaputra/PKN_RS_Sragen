const rawData1 = `
D00004 dr. ANI YULIANTI, Sp.S RABU 16:30:00 19:30:00 POLIKLINIK SARAF SORE 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, KAMIS 06:00:00 18:00:00 HEMODIALISA 30
`;

const lines = rawData1.trim().split('\n');
for (const line of lines) {
  const match = line.match(/^([A-Z0-9]+)\s+(.+?)\s+(SENIN|SELASA|RABU|KAMIS|JUMAT|SABTU|MINGGU)\s+([0-9:]+)\s+([0-9:]+)\s+(.+?)\s+(\d+)$/i);
  console.log("Match for:", line, "->", !!match);
}
