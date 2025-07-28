import { Button } from '@/Components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { saveAs } from 'file-saver';
import { ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExcelExport = ({selectedRows ,AllRows, fileName}) => {
    const exportToExcel = (rows, exportFileName) => {
        const dataToExport = rows.map(row => row.original);
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${exportFileName}.xlsx`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto bg-gray-50 dark:bg-gray-800 ">
                    Export Data <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-800 z-15 rounded-md border border-gray-200 dark:border-gray-700">
                <DropdownMenuItem onClick={() => exportToExcel(selectedRows, `${fileName}_selected`)} className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                    Export selected rows
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToExcel(AllRows, fileName)} className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                    Export all rows
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

}

export default ExcelExport;