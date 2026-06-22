import parseLinkAttributes from "@/utils/parseLinkAttributes";
import { ArrowUpDown } from "lucide-react";

// Sortable header cell matching the styling of the other data tables.
const sortableHeader = (label) => ({ column }) => (
    <div className="flex cursor-pointer items-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        {label}
        <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
    </div>
);

const textCell = (props) => <span>{props.getValue()}</span>;

const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <input
                type="checkbox"
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                }}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    { accessorKey: "source", header: sortableHeader("Source"), cell: textCell },
    { accessorKey: "pl_name", header: sortableHeader("Planet Name"), cell: textCell },
    { accessorKey: "discoverymethod", header: sortableHeader("Discovery Method"), cell: textCell },
    { accessorKey: "disc_facility", header: sortableHeader("Discovery Facility"), cell: textCell },
    { accessorKey: "pl_orbper", header: sortableHeader("Orbital Period [days]"), cell: textCell },
    { accessorKey: "pl_rade", header: sortableHeader("Planet Radius [Earth Radius]"), cell: textCell },
    { accessorKey: "pl_eqt", header: sortableHeader("Equilibrium Temperature [K]"), cell: textCell },
    { accessorKey: "pl_insol", header: sortableHeader("Insolation Flux [Earth Flux]"), cell: textCell },
    { accessorKey: "st_teff", header: sortableHeader("Stellar Effective Temperature [K]"), cell: textCell },
    { accessorKey: "st_rad", header: sortableHeader("Stellar Radius [Solar Radius]"), cell: textCell },
    { accessorKey: "st_logg", header: sortableHeader("Stellar Surface Gravity [log10(cm/s²)]"), cell: textCell },
    { accessorKey: "ra", header: sortableHeader("RA [deg]"), cell: textCell },
    { accessorKey: "dec", header: sortableHeader("Dec [deg]"), cell: textCell },
    {
        accessorKey: "exomoon_reference",
        header: sortableHeader("Exomoon Study Reference"),
        cell: (props) => {
            const references = parseLinkAttributes(props.getValue());

            if (!references || references.length === 0) {
                return null;
            }

            return (
                <div className="flex flex-col space-y-1">
                    {references.map((ref, index) => (
                        <a
                            key={index}
                            href={ref.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                            {ref.refstr || 'Link'}
                        </a>
                    ))}
                </div>
            );
        }
    },
];

export default columns;
