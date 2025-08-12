import parseLinkAttributes from "@/utils/parseLinkAttributes";
import { ArrowUpDown } from "lucide-react";
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
    {
        accessorKey: "pl_name",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Planet Name
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "hostname",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Host Name
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "exomoon_reference",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Exomoon Study Reference
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
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
    {
        accessorKey: "sy_snum",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Number of Stars
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "sy_pnum",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Number of Planets
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "discoverymethod",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Discovery Method
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "disc_year",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Discovery Year
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "disc_facility",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Discovery Facility
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "soltype",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Solution Type
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    
    
    {
        accessorKey: "pl_orbper",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Orbital Period
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_orbsmax",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Orbit Semi-Major Axis
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_rade",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Planet Radius
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_radj",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Planet Radius
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_bmasse",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Planet Mass or Mass*sin(i)
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_bmassj",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Planet Mass or Mass*sin(i)
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_bmassprov",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Planet Mass or Mass*sin(i) Provenance
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_orbeccen",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Eccentricity
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_insol",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Insolation Flux
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "pl_eqt",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Equilibrium Temperature
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "ttv_flag",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data show Transit Timing Variations
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    
    {
        accessorKey: "st_spectype",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Spectral Type
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "st_teff",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stellar Effective Temperature
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "st_rad",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stellar Radius
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "st_mass",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stellar Mass
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "st_met",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stellar Metallicity
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "st_metratio",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stellar Metallicity Ratio
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "st_logg",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stellar Surface Gravity
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    
    {
        accessorKey: "rastr",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    RA
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "ra",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    RA
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "decstr",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Dec
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "dec",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Dec
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "sy_dist",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Distance
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "sy_vmag",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    V (Johnson) Magnitude
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "sy_kmag",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ks (2MASS) Magnitude
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    {
        accessorKey: "sy_gaiamag",
        header: ({ column }) => {
            return (
                <div className="flex cursor-pointer items-center"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Gaia Magnitude
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-purple-500' : ''}`} />
                </div>
            )
        },
        cell: (props) => <span>{props.getValue()}</span>
    },
    
];
export default columns;