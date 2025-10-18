import React from "react";

const placementData = {
  overall: {
    companiesPlacement: 208,
    totalPlacementOffers: 1080,
    ugOffers: 736,
    pgOffers: 344,
    phdOffers: 0,
    companiesInternship: 46,
    totalInternshipOffers: 187,
    ugInternships: 116,
    pgInternships: 71,
  },
  placementStats: {
    total: {
      offers: 1080,
      registered: 1385,
      percentPlaced: 77.97,
      avgSalary: 12.11,
      medianSalary: 9,
      maxSalary: 50.64,
      minSalary: 3.5,
    },
    ug: {
      offers: 736,
      registered: 862,
      percentPlaced: 85.38,
      avgSalary: 12.41,
      medianSalary: 9,
      maxSalary: 50.64,
      minSalary: 3.5,
    },
    pg: {
      offers: 344,
      registered: 523,
      percentPlaced: 65.77,
      avgSalary: 11.41,
      medianSalary: 10,
      maxSalary: 39.27,
      minSalary: 4.2,
    },
  },
  ugBranches: [
    { name: "B.Tech Computer Science", percent: 96.77, max: 50.64, avg: 19.37 },
    { name: "B.Tech Electrical & Electronics", percent: 97.01, max: 36.42, avg: 10.99 },
    { name: "B.Tech Electronics & Commn.", percent: 88.59, max: 36.5, avg: 13.71 },
    { name: "B.Tech Chemical", percent: 86.66, max: 34.1, avg: 10.68 },
    { name: "B.Tech Mechanical", percent: 88.38, max: 34.1, avg: 9.67 },
    { name: "B.Tech Civil", percent: 84.26, max: 34.1, avg: 8.09 },
    { name: "B.Arch", percent: 2.63, max: 7.25, avg: 7.25 },
  ],
  pgBranches: [
    { name: "EC-M.Tech Micro Electronics & VLSI Design", percent: 85.71, max: 39.27, avg: 21.72 },
    { name: "CS-M.Tech Computer Science", percent: 79.16, max: 35, avg: 15.26 },
    { name: "CS-M.Tech Computer Science (Information Security)", percent: 80, max: 34.62, avg: 14.62 },
    { name: "NS-M.Tech Material Science & Engineering (Nano Technology)", percent: 75, max: 27.12, avg: 27.12 },
    { name: "CS - MCA", percent: 75.47, max: 29, avg: 10.63 },
    { name: "MS - MBA", percent: 51.28, max: 12, avg: 8.2 },
    { name: "PH - M.Sc. Physics", percent: null, max: null, avg: null, offers: "Nil", registered: 11 },
  ],
  internshipStats: {
    total: { placed: 187, registered: 1198, percent: 15.6 },
    ug: { placed: 116, registered: 804, percent: 14.42 },
    pg: { placed: 71, registered: 394, percent: 18.02 },
  },
  topRecruiters: [
    { name: "Larsen and Toubro", offers: 62 },
    { name: "Tata Motors", offers: 31 },
    { name: "Oracle", offers: 23 },
    { name: "TATA ELXSI", offers: 23 },
    { name: "Amazon", offers: 21 },
    { name: "BAJAJ AUTO & CHETAK TECHNOLOGY LIMITED", offers: 19 },
    { name: "JSW", offers: 19 },
    { name: "PwC India", offers: 18 },
    { name: "Reliance Industries", offers: 15 },
    { name: "Bharat Petroleum Corporation Limited", offers: 13 },
    { name: "Caterpillar", offers: 13 },
    { name: "Samsung Semiconductor", offers: 13 },
    { name: "TCS (INE Hiring)", offers: 13 },
    { name: "Wells Fargo", offers: 13 },
  ],
  topInternshipProviders: [
    { name: "Accenture", offers: 17 },
    { name: "Oracle", offers: 13 },
    { name: "Texas Instruments", offers: 13 },
    { name: "Calpine Tech", offers: 10 },
    { name: "Varroc Engineering", offers: 9 },
    { name: "Tata Elxsi", offers: 8 },
    { name: "Wells Fargo", offers: 8 },
    { name: "Dell", offers: 7 },
    { name: "Tata Motors", offers: 7 },
    { name: "AMD", offers: 6 },
    { name: "TATA Projects Internship", offers: 6 },
    { name: "Volvo", offers: 6 },
    { name: "BAJAJ AUTO & CHETAK TECHNOLOGY LIMITED", offers: 5 },
    { name: "Goldman Sachs", offers: 5 },
  ],
};

type StatCardProps = {
  title: string;
  value: string | number;
  unit?: string;
};
function StatCard({ title, value, unit }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <div className="text-lg font-semibold text-gray-700">{title}</div>
      <div className="text-2xl font-bold text-blue-700 mt-1">{value}{unit && <span className="text-base font-normal text-gray-500"> {unit}</span>}</div>
    </div>
  );
}

export default function PlacementAnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">NIT Calicut Placement & Internship Analytics 2023-24</h1>
      {/* Overall Summary */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overall Hiring Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Placement Companies" value={placementData.overall.companiesPlacement} unit="" />
          <StatCard title="Placement Offers" value={placementData.overall.totalPlacementOffers} unit="" />
          <StatCard title="Internship Companies" value={placementData.overall.companiesInternship} unit="" />
          <StatCard title="Internship Offers" value={placementData.overall.totalInternshipOffers} unit="" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
          <StatCard title="UG Offers" value={placementData.overall.ugOffers} unit="" />
          <StatCard title="PG Offers" value={placementData.overall.pgOffers} unit="" />
          <StatCard title="PhD Offers" value={placementData.overall.phdOffers} unit="" />
          <StatCard title="UG Internships" value={placementData.overall.ugInternships} unit="" />
          <StatCard title="PG Internships" value={placementData.overall.pgInternships} unit="" />
        </div>
      </section>
      {/* Placement Statistics */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Placement Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-2">Total (UG + PG)</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatCard title="Offers" value={placementData.placementStats.total.offers} unit="" />
              <StatCard title="Registered" value={placementData.placementStats.total.registered} unit="" />
              <StatCard title="% Placed" value={placementData.placementStats.total.percentPlaced} unit="%" />
              <StatCard title="Avg. Salary" value={placementData.placementStats.total.avgSalary} unit="L" />
              <StatCard title="Median Salary" value={placementData.placementStats.total.medianSalary} unit="L" />
              <StatCard title="Max Salary" value={placementData.placementStats.total.maxSalary} unit="L" />
              <StatCard title="Min Salary" value={placementData.placementStats.total.minSalary} unit="L" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-2">UG (B.Tech + B.Arch)</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatCard title="Offers" value={placementData.placementStats.ug.offers} unit="" />
              <StatCard title="Registered" value={placementData.placementStats.ug.registered} unit="" />
              <StatCard title="% Placed" value={placementData.placementStats.ug.percentPlaced} unit="%" />
              <StatCard title="Avg. Salary" value={placementData.placementStats.ug.avgSalary} unit="L" />
              <StatCard title="Median Salary" value={placementData.placementStats.ug.medianSalary} unit="L" />
              <StatCard title="Max Salary" value={placementData.placementStats.ug.maxSalary} unit="L" />
              <StatCard title="Min Salary" value={placementData.placementStats.ug.minSalary} unit="L" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-2">PG (M.Tech + MCA + MBA + M.Sc.)</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatCard title="Offers" value={placementData.placementStats.pg.offers} unit="" />
              <StatCard title="Registered" value={placementData.placementStats.pg.registered} unit="" />
              <StatCard title="% Placed" value={placementData.placementStats.pg.percentPlaced} unit="%" />
              <StatCard title="Avg. Salary" value={placementData.placementStats.pg.avgSalary} unit="L" />
              <StatCard title="Median Salary" value={placementData.placementStats.pg.medianSalary} unit="L" />
              <StatCard title="Max Salary" value={placementData.placementStats.pg.maxSalary} unit="L" />
              <StatCard title="Min Salary" value={placementData.placementStats.pg.minSalary} unit="L" />
            </div>
          </div>
        </div>
      </section>
      {/* UG Branch-wise Placement */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">UG Placement Details (Select Branches)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 text-left">Branch</th>
                <th className="py-2 px-4 text-center">% Placed</th>
                <th className="py-2 px-4 text-center">Max Salary (L)</th>
                <th className="py-2 px-4 text-center">Avg. Salary (L)</th>
              </tr>
            </thead>
            <tbody>
              {placementData.ugBranches.map((b) => (
                <tr key={b.name} className="border-b">
                  <td className="py-2 px-4">{b.name}</td>
                  <td className="py-2 px-4 text-center">{b.percent ?? "-"}</td>
                  <td className="py-2 px-4 text-center">{b.max ?? "-"}</td>
                  <td className="py-2 px-4 text-center">{b.avg ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* PG Branch-wise Placement */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">PG Placement Details (Select Branches)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 text-left">Branch</th>
                <th className="py-2 px-4 text-center">% Placed</th>
                <th className="py-2 px-4 text-center">Max Salary (L)</th>
                <th className="py-2 px-4 text-center">Avg. Salary (L)</th>
              </tr>
            </thead>
            <tbody>
              {placementData.pgBranches.map((b) => (
                <tr key={b.name} className="border-b">
                  <td className="py-2 px-4">{b.name}</td>
                  <td className="py-2 px-4 text-center">{b.percent ?? "-"}</td>
                  <td className="py-2 px-4 text-center">{b.max ?? "-"}</td>
                  <td className="py-2 px-4 text-center">{b.avg ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Internship Statistics */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Internship Statistics (2023-24)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-2">Total (UG + PG)</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatCard title="Placed" value={placementData.internshipStats.total.placed} unit="" />
              <StatCard title="Registered" value={placementData.internshipStats.total.registered} unit="" />
              <StatCard title="% Placed" value={placementData.internshipStats.total.percent} unit="%" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-2">UG (B.Tech)</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatCard title="Placed" value={placementData.internshipStats.ug.placed} unit="" />
              <StatCard title="Registered" value={placementData.internshipStats.ug.registered} unit="" />
              <StatCard title="% Placed" value={placementData.internshipStats.ug.percent} unit="%" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-2">PG (M.Tech + MCA)</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatCard title="Placed" value={placementData.internshipStats.pg.placed} unit="" />
              <StatCard title="Registered" value={placementData.internshipStats.pg.registered} unit="" />
              <StatCard title="% Placed" value={placementData.internshipStats.pg.percent} unit="%" />
            </div>
          </div>
        </div>
      </section>
      {/* Top Recruiters */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Placement Recruiters (by Offers)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 text-left">Company</th>
                <th className="py-2 px-4 text-center">Offers</th>
              </tr>
            </thead>
            <tbody>
              {placementData.topRecruiters.map((r) => (
                <tr key={r.name} className="border-b">
                  <td className="py-2 px-4">{r.name}</td>
                  <td className="py-2 px-4 text-center">{r.offers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Top Internship Providers */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Internship Providers (by Offers)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 text-left">Company</th>
                <th className="py-2 px-4 text-center">Offers</th>
              </tr>
            </thead>
            <tbody>
              {placementData.topInternshipProviders.map((r) => (
                <tr key={r.name} className="border-b">
                  <td className="py-2 px-4">{r.name}</td>
                  <td className="py-2 px-4 text-center">{r.offers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="text-xs text-gray-500 mt-8">Note: Registered students include those with a CGPA ≥6.5 who participated in all CCD registrations. Students with CGPA &lt;6.5 who received an offer are included in both placed and registered counts.</div>
    </div>
  );
}
