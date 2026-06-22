// Builds the "Combined Data" dataset: the union of the Cumulative Kepler and
// Planetary Systems tables across the columns they share.
//
// Both sources are mapped onto one shared schema. To keep things simple the
// canonical keys reuse the Planetary-Systems accessor names (pl_name, pl_orbper,
// ...), so the existing getColumnLabel() mapping and column headers apply with
// no extra wiring. Cumulative (Kepler) rows carry no discovery metadata, so they
// are tagged Discovery Method = Transit and Discovery Facility = Kepler.

// Shared columns, in display order. Each entry maps the canonical key to its
// source column in the cumulative and ps datasets (null = supplied as a constant).
export const COMBINED_FIELDS = [
    { key: 'pl_name', cumulative: 'kepler_name', ps: 'pl_name' },
    { key: 'discoverymethod', cumulative: null, ps: 'discoverymethod' },
    { key: 'disc_facility', cumulative: null, ps: 'disc_facility' },
    { key: 'pl_orbper', cumulative: 'koi_period', ps: 'pl_orbper' },
    { key: 'pl_rade', cumulative: 'koi_prad', ps: 'pl_rade' },
    { key: 'pl_eqt', cumulative: 'koi_teq', ps: 'pl_eqt' },
    { key: 'pl_insol', cumulative: 'koi_insol', ps: 'pl_insol' },
    { key: 'st_teff', cumulative: 'koi_steff', ps: 'st_teff' },
    { key: 'st_rad', cumulative: 'koi_srad', ps: 'st_rad' },
    { key: 'st_logg', cumulative: 'koi_slogg', ps: 'st_logg' },
    { key: 'ra', cumulative: 'ra', ps: 'ra' },
    { key: 'dec', cumulative: 'dec', ps: 'dec' },
    { key: 'exomoon_reference', cumulative: 'exomoon_reference', ps: 'exomoon_reference' },
];

const pick = (row, col) => (col && row[col] != null ? row[col] : '');

export const buildCombinedData = (cumulativeRows = [], psRows = []) => {
    const fromCumulative = cumulativeRows
        .filter((r) => r && (r.kepler_name || r.kepoi_name))
        .map((r) => {
            const out = { source: 'Cumulative Kepler' };
            COMBINED_FIELDS.forEach(({ key, cumulative }) => {
                out[key] = pick(r, cumulative);
            });
            // Cumulative rows have no Kepler name for unconfirmed candidates;
            // fall back to the KOI name so every row is identifiable.
            out.pl_name = r.kepler_name || r.kepoi_name || '';
            out.discoverymethod = 'Transit';
            out.disc_facility = 'Kepler';
            return out;
        });

    const fromPs = psRows
        .filter((r) => r && r.pl_name)
        .map((r) => {
            const out = { source: 'Planetary Systems' };
            COMBINED_FIELDS.forEach(({ key, ps }) => {
                out[key] = pick(r, ps);
            });
            return out;
        });

    return [...fromCumulative, ...fromPs];
};

export default buildCombinedData;
