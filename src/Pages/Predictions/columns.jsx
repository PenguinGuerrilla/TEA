import { ArrowUpDown } from "lucide-react";
import { getColumnLabel } from "@/Pages/Statistics/columnLabels";

const sortableHeader = (label) => ({ column }) => (
    <div className="flex cursor-pointer items-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        {label}
        <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
    </div>
);

const textCell = (props) => {
    const v = props.getValue();
    return <span>{v === null || v === undefined || v === '' ? '—' : v}</span>;
};

const numCell = (digits) => (props) => {
    const v = props.getValue();
    const n = Number(v);
    return <span>{v === '' || v === null || v === undefined || Number.isNaN(n) ? '—' : n.toFixed(digits)}</span>;
};

const scoreColumn = {
    accessorKey: "score",
    header: sortableHeader("Predicted Score"),
    cell: (props) => {
        const n = Number(props.getValue());
        // purple intensity scales with score
        const pct = Math.max(0, Math.min(1, n));
        return (
            <span style={{
                fontWeight: 600,
                color: '#fff',
                backgroundColor: `rgba(139, 92, 246, ${0.25 + 0.6 * pct})`,
                padding: '2px 8px',
                borderRadius: '6px',
            }}>
                {Number.isNaN(n) ? '—' : n.toFixed(3)}
            </span>
        );
    },
};

const knownColumn = {
    accessorKey: "is_known_candidate",
    header: sortableHeader("Status"),
    cell: (props) => {
        const known = Number(props.getValue()) === 1;
        return (
            <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '9999px',
                color: known ? '#a5b4fc' : '#6ee7b7',
                backgroundColor: known ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
            }}>
                {known ? 'Known candidate' : 'New prediction'}
            </span>
        );
    },
};

const col = (key, digits = null) => ({
    accessorKey: key,
    header: sortableHeader(getColumnLabel(key)),
    cell: digits === null ? textCell : numCell(digits),
});

// Display columns differ per model (each prediction CSV carries its own
// physical features). Score + status + name are common.
const FEATURE_COLUMNS = {
    kepler: [col("koi_period", 2), col("koi_prad", 2), col("koi_teq", 0), col("koi_model_snr", 1)],
    ps: [col("pl_orbper", 2), col("pl_rade", 2), col("pl_bmasse", 2), col("pl_eqt", 0)],
    combined: [col("pl_orbper", 2), col("pl_rade", 2), col("pl_eqt", 0)],
};

export const getPredictionColumns = (model) => [
    scoreColumn,
    knownColumn,
    { accessorKey: "name", header: sortableHeader("Name"), cell: textCell },
    { accessorKey: "id", header: sortableHeader("ID"), cell: textCell },
    ...(FEATURE_COLUMNS[model] || []),
];

export default getPredictionColumns;
