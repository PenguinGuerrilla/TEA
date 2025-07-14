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

const PsTable = () => {
  const [data, setData] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      Papa.parse('/PS_only_default_2.csv', {
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
      accessorKey: "pl_name",
      header: "Planet Name",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "hostname",
      header: "Host Name",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "default_flag",
      header: "Default Parameter Set",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "sy_snum",
      header: "Number of Stars",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "sy_pnum",
      header: "Number of Planets",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "discoverymethod",
      header: "Discovery Method",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "disc_year",
      header: "Discovery Year",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "disc_facility",
      header: "Discovery Facility",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "soltype",
      header: "Solution Type",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_refname",
      header: "Planetary Parameter Reference",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_orbper",
      header: "Orbital Period",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_orbsmax",
      header: "Orbit Semi-Major Axis",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_rade",
      header: "Planet Radius",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_radj",
      header: "Planet Radius",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_bmasse",
      header: "Planet Mass or Mass*sin(i)",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_bmassj",
      header: "Planet Mass or Mass*sin(i)",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_bmassprov",
      header: "Planet Mass or Mass*sin(i) Provenance",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_orbeccen",
      header: "Eccentricity",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_insol",
      header: "Insolation Flux",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_eqt",
      header: "Equilibrium Temperature",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "ttv_flag",
      header: "Data show Transit Timing Variations",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_refname",
      header: "Stellar Parameter Reference",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_spectype",
      header: "Spectral Type",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_teff",
      header: "Stellar Effective Temperature",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_rad",
      header: "Stellar Radius",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_mass",
      header: "Stellar Mass",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_met",
      header: "Stellar Metallicity",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_metratio",
      header: "Stellar Metallicity Ratio",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "st_logg",
      header: "Stellar Surface Gravity",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "sy_refname",
      header: "System Parameter Reference",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "rastr",
      header: "RA",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "ra",
      header: "RA",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "decstr",
      header: "Dec",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "dec",
      header: "Dec",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "sy_dist",
      header: "Distance",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "sy_vmag",
      header: "V (Johnson) Magnitude",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "sy_kmag",
      header: "Ks (2MASS) Magnitude",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "sy_gaiamag",
      header: "Gaia Magnitude",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "rowupdate",
      header: "Date of Last Update",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "pl_pubdate",
      header: "Planetary Parameter Reference Publication Date",
      cell: (props) => <span>{props.getValue()}</span>
    },
    {
      accessorKey: "releasedate",
      header: "Release Date",
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
            Planetary Systems Data
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

export default PsTable