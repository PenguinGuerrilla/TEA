// Display labels matching the table headers in
// CumulativeKeplerData/columns.jsx and PlanetarySystemsData/columns.jsx.
// Duplicated table labels (e.g. pl_rade / pl_radj) get a unit suffix.
const COLUMN_LABELS = {
    // Cumulative Kepler Data
    kepid: 'Kepler ID',
    kepoi_name: 'KOI Name',
    kepler_name: 'Kepler Name',
    koi_disposition: 'Exoplanet Archive Disposition',
    koi_pdisposition: 'Disposition Using Kepler Data',
    koi_score: 'Disposition Score',
    koi_period: 'Orbital Period',
    koi_teq: 'Equilibrium Temperature',
    koi_srad: 'Stellar Radius',
    koi_time0bk: 'Transit Epoch',
    koi_impact: 'Impact Parameter',
    koi_duration: 'Transit Duration',
    koi_depth: 'Transit Depth',
    koi_prad: 'Planetary Radius',
    koi_insol: 'Insolation Flux',
    koi_model_snr: 'Transit Signal-to-Noise',
    koi_tce_plnt_num: 'TCE Planet Number',
    koi_tce_delivname: 'TCE Delivery',
    koi_steff: 'Stellar Effective Temperature',
    koi_slogg: 'Stellar Surface Gravity',
    koi_kepmag: 'Kepler-band',

    // Planetary Systems Data
    pl_name: 'Planet Name',
    hostname: 'Host Name',
    sy_snum: 'Number of Stars',
    sy_pnum: 'Number of Planets',
    discoverymethod: 'Discovery Method',
    disc_year: 'Discovery Year',
    disc_facility: 'Discovery Facility',
    soltype: 'Solution Type',
    pl_orbper: 'Orbital Period',
    pl_orbsmax: 'Orbit Semi-Major Axis',
    pl_rade: 'Planet Radius (Earth radii)',
    pl_radj: 'Planet Radius (Jupiter radii)',
    pl_bmasse: 'Planet Mass or Mass*sin(i) (Earth mass)',
    pl_bmassj: 'Planet Mass or Mass*sin(i) (Jupiter mass)',
    pl_bmassprov: 'Planet Mass or Mass*sin(i) Provenance',
    pl_orbeccen: 'Eccentricity',
    pl_insol: 'Insolation Flux',
    pl_eqt: 'Equilibrium Temperature',
    ttv_flag: 'Data show Transit Timing Variations',
    st_spectype: 'Spectral Type',
    st_teff: 'Stellar Effective Temperature',
    st_rad: 'Stellar Radius',
    st_mass: 'Stellar Mass',
    st_met: 'Stellar Metallicity',
    st_metratio: 'Stellar Metallicity Ratio',
    st_logg: 'Stellar Surface Gravity',
    sy_dist: 'Distance',
    sy_vmag: 'V (Johnson) Magnitude',
    sy_kmag: 'Ks (2MASS) Magnitude',
    sy_gaiamag: 'Gaia Magnitude',

    // Shared / not shown in tables
    ra: 'RA',
    dec: 'Dec',

    // Combined Data
    source: 'Source Dataset',

    // Predictions
    score: 'Predicted Score',
    is_known_candidate: 'Status',
    name: 'Name',
    id: 'ID',
};

export const getColumnLabel = (col) => COLUMN_LABELS[col] || col;

export default COLUMN_LABELS;
