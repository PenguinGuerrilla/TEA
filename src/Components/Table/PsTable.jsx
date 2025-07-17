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
import Navbar from '../Navbar.jsx';
import parseLinkAttributes from '@/utils/parseLinkAttributes.js';
const PsTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsDataLoaded(false);
      Papa.parse('/PS_only_default_no_duplicates.csv', {
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
      accessorKey: "pl_name",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Planet Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_refname",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Planetary Parameter Reference
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <a target="_blank" rel="noopener noreferrer" href={parseLinkAttributes(props.getValue()).href} >{parseLinkAttributes(props.getValue()).refstr}</a>
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_refname",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stellar Parameter Reference
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <a target="_blank" rel="noopener noreferrer" href={parseLinkAttributes(props.getValue()).href} >{parseLinkAttributes(props.getValue()).refstr}</a>
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "sy_refname",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            System Parameter Reference
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <a target="_blank" rel="noopener noreferrer" href={parseLinkAttributes(props.getValue()).href} >{parseLinkAttributes(props.getValue()).refstr}</a>
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "rowupdate",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date of Last Update
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_pubdate",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Planetary Parameter Reference Publication Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "releasedate",
      header: ({ column }) => {
        return (
          <div className="flex cursor-pointer items-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Release Date
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
            Planetary Systems Data
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

export default PsTable