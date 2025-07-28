import { ArrowUpDown } from "lucide-react";
import parseLinkAttributes from "@/utils/parseLinkAttributes";
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
      size: 10,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Article Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "source",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Source
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
      accessorKey: "exoplanets_analyzed",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Exoplanets Analyzed
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },


  ];
  export default columns;