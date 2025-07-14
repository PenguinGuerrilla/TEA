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

const CumulativeTable = () => {
  const [data, setData] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      Papa.parse('/cumulative.csv', {
        download: true,
        header: true,
        complete: (results) => {
          setData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
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
    pageSize: 10, //default page size
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
      <div className="rounded-sm border border-gray-200 bg-white px-5 pt-6 pb-2.5 shadow-md sm:px-7.5 xl:pb-1">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-black mb-2">
            Cummulative Kepler Data
          </h4>
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-1/3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            placeholder="Pesquisar..."
          />
        </div>

        {/* Tabela Shadcn/ui */}
        <div className="overflow-auto rounded-md border" style={{ height: '500px' }}>
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase text-gray-600">
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
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap px-4 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhum resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Controles de Paginação Estilizados */}
        <div className="flex items-center justify-between p-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
          <div className="flex items-center space-x-4">
            {/* --- Previous Button --- */}
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            {/* --- Page Indicator --- */}
            <span className="text-sm font-medium text-gray-700">
              Página{' '}
              <span className="font-bold text-indigo-600">
                {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </span>
            </span>

            {/* --- Next Button --- */}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
          <div className="flex flex-1 justify-end">
            {/* --- Page Size Selector --- */}
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
              <option value={data.length}>
                Mostrar Todos
              </option>
            </select>
          </div>
        </div>
      </div>
    </>

  );
};

export default CumulativeTable