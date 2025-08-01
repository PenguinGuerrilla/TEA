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
      accessorKey: "kepid",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kepler ID
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "kepoi_name",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            KOI Name
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "kepler_name",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kepler Name
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
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
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
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
      accessorKey: "koi_disposition",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Exoplanet Archive Disposition
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "koi_pdisposition",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Disposition Using Kepler Data
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "koi_score",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Disposition Score
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "koi_period",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Orbital Period
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_teq",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Equilibrium Temperature
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "koi_srad",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stellar Radius
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_time0bk",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Transit Epoch
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_impact",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Impact Parameter
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_duration",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Transit Duration
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_depth",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Transit Depth
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_prad",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Planetary Radius
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },


    {
      accessorKey: "koi_insol",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Insolation Flux
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_model_snr",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Transit Signal-to-Noise
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_tce_plnt_num",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            TCE Planet Number
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_tce_delivname",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            TCE Delivery
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_steff",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stellar Effective Temperature
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_slogg",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stellar Surface Gravity
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },

    {
      accessorKey: "koi_kepmag",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kepler-band
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-indigo-500' : ''}`} />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    }


  ];

  export default columns;