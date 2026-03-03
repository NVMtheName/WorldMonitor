import type { CyberThreat } from '../types/index.js';

// Fetch recent CVEs from NIST NVD (free, no key needed)
export async function fetchCyberThreats(): Promise<CyberThreat[]> {
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const startDate = threeDaysAgo.toISOString().split('.')[0] + '.000';
    const endDate = now.toISOString().split('.')[0] + '.000';

    const res = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${startDate}&pubEndDate=${endDate}&resultsPerPage=20`
    );
    if (!res.ok) return getFallbackThreats();
    const data = await res.json();

    return (data.vulnerabilities || []).slice(0, 15).map((v: any) => {
      const cve = v.cve;
      const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV2?.[0];
      const score = metrics?.cvssData?.baseScore || 0;

      let severity: CyberThreat['severity'] = 'low';
      if (score >= 9) severity = 'critical';
      else if (score >= 7) severity = 'high';
      else if (score >= 4) severity = 'medium';

      return {
        title: cve.id + ': ' + (cve.descriptions?.[0]?.value || 'No description').slice(0, 120),
        severity,
        source: 'NVD',
        date: cve.published || new Date().toISOString(),
        url: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
        description: cve.descriptions?.[0]?.value || '',
      };
    });
  } catch {
    return getFallbackThreats();
  }
}

function getFallbackThreats(): CyberThreat[] {
  return [
    {
      title: 'Unable to fetch live CVE data',
      severity: 'low',
      source: 'System',
      date: new Date().toISOString(),
      url: 'https://nvd.nist.gov/',
      description: 'Check back later for live vulnerability data from NVD.',
    },
  ];
}
