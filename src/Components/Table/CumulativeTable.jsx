"use client"

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { useState } from 'react'
// import DATA from './data';
import { ArrowUpDown } from "lucide-react";
import Papa from 'papaparse';
import Navbar from "../Navbar";
import parseLinkAttributes from "@/utils/parseLinkAttributes";

const CumulativeTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);


  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsDataLoaded(false);
      Papa.parse('/cumulative2.csv', {
        download: true,
        header: true,
        complete: (results) => {
          setData(results.data);
          setIsDataLoaded(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 500); // Corresponds to animation duration
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
          setIsLoading(false);
        }
      });
    };

    fetchData();
  }, []);
  const [columnFilters, setColumnFilters] = React.useState([]);
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <a target="_blank" rel="noopener noreferrer" href={parseLinkAttributes(props.getValue()).href} >{parseLinkAttributes(props.getValue()).refstr}</a>
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    }


  ];
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 15, //default page size
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      pagination,
      globalFilter,
      rowSelection,
    },
  });

  return (
    <>
      <Navbar />
      <div className="rounded-sm border border-gray-200 bg-white px-5 pt-6 pb-2.5 shadow-md sm:px-7.5 xl:pb-1 dark:bg-gray-900 dark:border-gray-700">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-black mb-2 dark:text-white">
            Cumulative Kepler Data
          </h4>
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-1/3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-offset-gray-800"
            placeholder="Search..."
          />
        </div>

        {/* Tabela Shadcn/ui */}
        <div className="overflow-auto rounded-md border dark:border-gray-700" style={{ height: '600px' }}>
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase text-gray-600 dark:text-gray-400">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className={`transition-opacity duration-300 ${isDataLoaded ? 'opacity-100' : 'opacity-0'}`}>
              {isLoading ? (
                [...Array(15)].map((_, i) => (
                  <TableRow key={i} className="dark:border-gray-700">
                    {[...Array(columns.length)].map((_, j) => (
                      <TableCell key={j} className="whitespace-nowrap px-4 py-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="dark:border-gray-700"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap px-4 py-2 dark:text-gray-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center dark:text-gray-300">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Controles de Paginação Estilizados */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 md:flex-row">
          <div className="text-sm text-muted-foreground dark:text-gray-400">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page{' '}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            >
              {[15, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
              <option value={data.length}>
                Show All
              </option>
            </select>
          </div>
        </div>
      </div>
    </>

  );
};

export default CumulativeTable